import csv
import gurobipy as gp
import os
import numpy as np

####################################################
####  Load item data
####################################################

# def get_item_data():
df={}
i=0
with open("data/item_data.csv", "r") as opened_file:
    reader =  csv.reader(opened_file)
    #rod_lengths_quantity = list(reader)
    for row in reader:
        if i == 0:
            items = row
        else:
            df[i] = row
        i+=1

ID, IDother, Item, FoodGroup, Grams, Price, Utility, Time, Energy, Protein, Fat, Carb, Sugar, Fiber = gp.multidict(df)
# print(ID)

####################################################
####  Load distance data
####################################################
            
df3={}
count=0
with open("data/distance_data.csv", "r") as opened_file:
    reader =  csv.reader(opened_file)
    #rod_lengths_quantity = list(reader)
    for row in reader:
        if count == 0:
            locations = row
        else:
            df3[count] = row
        count+=1
            
Distance = {}
for i in df3:
    for j in range(0,len(locations)):
        if j > 0:
            Distance[locations[j],df3[i][0]] = df3[i][j]

## Input

##maybe add constraint to say that recipe is only when len() > 1

grocery_list = [['Butter, without salt', 'Lamb, New Zealand, imported, square-cut shoulder chops, separable lean and fat, cooked, braised', 'Rosemary, fresh'], ['Cauliflower, green, cooked, with salt', 'Rice, white, glutinous, cooked'],['Ice creams, vanilla']]
#grocery_list = [['Ice creams, vanilla']]

def optimize_shopping(grocery_list, IDother, Utility, Item, Time, Energy, Protein, Fat, Carb, Sugar, FoodGroup, Distance):
    """Function that takes in all the inputs required and optimizes the grocery shopping problem"""
    target_utility = 0.8
    
    # min utility and nutrients required
    U = 0
    min_protein = 0
    min_carbs = 0
    min_fat = 0
    min_sugar = 0
    min_calories = 0

    for rec in grocery_list:
        for i in rec:
            if len(rec) > 1:
                # print('TESTING HERE *************', IDother, Item.values())
                key = IDother.keys()[Item.values().index(i)]
                U += 2*float(Utility[key])
                min_protein += float(Protein[key])
                min_carbs += float(Carb[key])
                min_fat += float(Fat[key])
                min_sugar += float(Sugar[key])
                min_calories += float(Energy[key])
            else:
                key = IDother.keys()[Item.values().index(i)]
                U += float(Utility[key])
                min_protein += float(Protein[key])
                min_carbs += float(Carb[key])
                min_fat += float(Fat[key])
                min_sugar += float(Sugar[key])
                min_calories += float(Energy[key])
    
    U = target_utility*U       
    min_protein = target_utility*min_protein
    min_carbs = target_utility*min_carbs
    min_fat = target_utility*min_fat
    min_sugar = target_utility*min_sugar
    min_calories = target_utility*min_calories    
    # cap
            
    item_needed = {}
    for i in range(1,len(FoodGroup)):
        item_needed[Item[i]] = 0
    
    for rec in grocery_list:
        for i in rec:
            item_needed[i] += 1
    
    ## Data
    v_speed = 1 # m/sec 
    
    time_per_sectionitem = {}
    for i in range(1,len(FoodGroup)):
         time_per_sectionitem[Item[i]] = float(Time[i])

    distance = {}
    for i in Distance:
         distance[i] = float(Distance[i])
    
    # sections list needs to have "ENTER" and "EXIT" sections and we need to initialize
    sections = []
    for i in distance:
        if i[0] not in sections:
            sections.append(i[0])    
         
    item_sections = {}
    for i in range(1,len(FoodGroup)):
        item_sections[Item[i]] = FoodGroup[i]
    
    item_utility = {}
    for i in range(1,len(FoodGroup)):
         item_utility[Item[i]] = Utility[i]
    
    protein = {}
    for i in range(1,len(FoodGroup)):
        protein[Item[i]] = float(Protein[i])
    
    fat = {}
    for i in range(1,len(FoodGroup)):
        fat[Item[i]] = float(Fat[i])
        
    carbs = {}
    for i in range(1,len(FoodGroup)):
        carbs[Item[i]] = float(Carb[i])
        
    sugar = {}
    for i in range(1,len(FoodGroup)):
        sugar[Item[i]] = float(Sugar[i])
        
    calories = {}
    for i in range(1,len(FoodGroup)):
        calories[Item[i]] = float(Energy[i])
    
    
    
    recipes = []
    
    for r in range(len(grocery_list)):
        if len(grocery_list[r]) > 1:
            recipes.append('recipe_' + str(r))
    
    # recipe_utility = bj
    recipe_utility =  {}
    for r in recipes:
        recipe_utility[r] = 0 
        for item in grocery_list[int(r[-1])]:
           
            recipe_utility[r] += float(item_utility[item])
        
    
    ##################################################
    ##initilizing model
    ##################################################

    m = gp.Model('Grocery')
    
    
    ##################################################
    ## Decision Variables
    ##################################################

    section_visited = {}
    for s in sections:
        section_visited[s] = m.addVar(vtype=gp.GRB.BINARY)
    
    order_of_visits = {}
    for i in sections:   
        for j in sections:
            order_of_visits[i,j] = m.addVar(vtype=gp.GRB.BINARY)
    
    item_purchased = {}
    for item in protein:
        item_purchased[item] = m.addVar(lb=0,ub= item_needed[item], vtype = gp.GRB.INTEGER)

    
    recipe_complete = {}
    for r in recipes:
        recipe_complete[r] = m.addVar(vtype = gp.GRB.BINARY)
    
    
    path = {}
    n = len(sections)
    
        
    for i in range(n):
        path[sections[i]] = m.addVar(vtype = gp.GRB.INTEGER)

    ##################################################
    ## Objective
    ##################################################
        
    m.setObjective(sum(distance[i,j]*order_of_visits[i,j]/v_speed for i,j in order_of_visits)
                   + sum(item_purchased[item]*time_per_sectionitem[item] for item in item_sections), gp.GRB.MINIMIZE)
    
    ##################################################
    ## Constraints
    ##################################################

    
    # 0) Ensure Entry and Exit are properly configured
    
    m.addConstr(sum(order_of_visits['Entry',s] for s in sections) == 1)
    m.addConstr(sum(order_of_visits[s, 'Entry'] for s in sections) == 0)
    
    m.addConstr(sum(order_of_visits['Exit',s] for s in sections) == 0)
    m.addConstr(sum(order_of_visits[s, 'Exit'] for s in sections) == 1)
    
    m.addConstr(sum(order_of_visits['Entry', 'Exit'] for s in sections) == 0)
    
    
    # 1) TSP: Avoid pairs of going back and forth (now we have triplets that we need to fix)
    
    # Dantzig–Fulkerson–Johnson formulation
    
    # for s1 in sections:
    #     for s2 in sections:
    #         m.addConstr(order_of_visits[s1,s2] + order_of_visits[s2,s1] <= 1)
    
    # for s1 in sections:
    #     for s2 in sections:
    #         for s3 in sections:
    #             m.addConstr(order_of_visits[s1,s2] + order_of_visits[s1,s3] + order_of_visits[s2,s3] 
    #             + order_of_visits[s2,s1] + order_of_visits[s3,s1] + order_of_visits[s3,s2] <= 2)
    
    
    # Miller–Tucker–Zemlin formulation
    for s1 in sections:
        for s2 in sections:
            m.addConstr(path[s1] - path[s2] + n*order_of_visits[s1,s2] <= n - 1)
    
    for s in sections:
        m.addConstr(path[s] <= n-1)
        
    m.addConstr(path['Exit'] == n-1)
        
    # 2) can't visit same section twice
    for s in sections:   
        m.addConstr(order_of_visits[s,s] == 0)
       
    # 3) ensure min utility is met     
    m.addConstr(sum(item_purchased[item]*item_utility[item] for item in item_purchased ) 
                + sum(recipe_complete[rec]*recipe_utility[rec]  for rec in recipes) >= U)    
    
    # 4) for every complete recipe make sure we have all the items
    for rec in recipe_complete:
        for item in grocery_list[int(rec[-1])]:
            m.addConstr(item_purchased[item] >= recipe_complete[rec])
            
    # 5) for items we purchase make sure we visit their sections
    for item in item_purchased:   
            m.addConstr(section_visited[item_sections[item]] >= item_purchased[item]/1000)

    # 6) nutrients constraints
    m.addConstr(sum(protein[item] * item_purchased[item] for item in item_purchased) >= min_protein)
    m.addConstr(sum(carbs[item] * item_purchased[item] for item in item_purchased) >= min_carbs)
    m.addConstr(sum(fat[item] * item_purchased[item] for item in item_purchased) >= min_fat)
    m.addConstr(sum(sugar[item] * item_purchased[item] for item in item_purchased) >= min_sugar)
    m.addConstr(sum(calories[item] * item_purchased[item] for item in item_purchased) >= min_calories)
    
    # 7) if section is visited, incoming traffic > 1
    for sec in sections:
        m.addConstr(sum(order_of_visits[i,sec] for i in sections) >= section_visited[sec] )
        
    # 8) for all sections incoming traffic equals outgoing traffic (except for Entry and Exit)
    for sec in sections:
        if sec != 'Entry' and sec != 'Exit':
            m.addConstr(sum(order_of_visits[i,sec] for i in sections) == 
                        sum(order_of_visits[sec,j] for j in sections))
      
    m.optimize()
    
    item_purchased_out = {}
    item_needed_out = {}
    section_visited_out = []
    order_of_visits_out = {}
    recipe_complete_out = []
    for i in item_purchased:
        if item_purchased[i].x != 0:
            item_purchased_out[i] = item_purchased[i].x
    for i in item_needed:
        if item_needed[i] != 0:
            item_needed_out[i] = item_needed[i]
    for i in section_visited:
        if section_visited[i].x != 0:
            section_visited_out.append(i)
    for i in order_of_visits:
        if order_of_visits[i].x != 0:
            order_of_visits_out[i] = order_of_visits[i].x

    for i in recipe_complete:

        if recipe_complete[i].x != 0:
            recipe_complete_out.append(i)
    path_out = {}
    for i in path:
        if path[i].x != 0:
            path_out[path[i].x] = i
    print('PATH OUT')
    print(path_out)
    # print(path)
    print(section_visited_out)
    return(m, item_purchased_out, item_needed_out, order_of_visits, path,section_visited, item_sections)
    # return(m, item_purchased_out, item_needed_out, section_visited_out, order_of_visits_out, recipe_complete_out, path_out, item_sections)
    # return(m, item_purchased_out, item_needed_out, section_visited_out, order_of_visits_out, recipe_complete_out, path_out, item_sections)


# grocery_list = [['Peppers, jalapeno, raw', 'Snacks, tortilla chips, unsalted, white corn', 'Chicken, broiler, rotisserie, BBQ, drumstick meat and skin', 'Cheese, low fat, cheddar or colby', 'PACE, Chipotle Chunky Salsa', 'Queso cotija', 'Avocados, raw, California'],
# ['Lemon juice, raw', 'Potatoes, red, flesh and skin, raw', 'Oil, olive, salad or cooking', 'Spices, chili powder', 'Fish, cod, Pacific, untreated, cooked', 'Onions, spring or scallions (includes tops and bulb), raw'],
# ['Beans, snap, green, frozen, cooked, boiled, drained without salt', 'Lamb, domestic, foreshank, separable lean and fat, trimmed to 1/8" fat, choice, raw', 'Carrots, baby, raw', 'Onions, raw', 'Wheat flour, whole-grain, soft wheat', 'Alcoholic beverage, wine, cooking', 'Soup, chicken broth, canned, less/reduced sodium']]
grocery_list = [['Pie, coconut custard, commercially prepared', 'Ice creams, vanilla', 'Butter, without salt']]
def optimize(grocery_list):
    m, item_purchased, item_needed, order_of_visits, path,section_visited, item_sections = optimize_shopping(grocery_list, IDother, Utility, Item, Time, Energy, Protein, Fat, Carb, Sugar, FoodGroup, Distance)
    # m, item_purchased, item_needed, sections_visited, order_of_visits, recipe_complete, path, item_sections = optimize_shopping(grocery_list, IDother, Utility, Item, Time, Energy, Protein, Fat, Carb, Sugar, FoodGroup, Distance)
    # m, item_purchased, item_needed, sections_visited, order_of_visits, recipe_complete, path, item_sections = optimize_shopping(grocery_list, IDother, Utility, Item, Time, Energy, Protein, Fat, Carb, Sugar, FoodGroup, Distance)
    # if m.status == gp.GRB.OPTIMAL:
    #     # print('item purchased', item_purchased)
    #     # print('item needed', item_needed)
    #     # print('sections visited', sections_visited)
    #     # print('order of visits', order_of_visits)
    #     # print('recipe complete', recipe_complete)
    #     # print('path', path)
    #     print('item sections', item_sections['Pie, coconut custard, commercially prepared'])
    #     section_item_purchased_map = {}
    #     for item in item_purchased:
    #         section = item_sections[item]
    #         print('item', item, 'section', section)
    #         if section in section_item_purchased_map:
    #             section_item_purchased_map[section].append(item)
    #         else:
    #             section_item_purchased_map[section] = [item]
    #     # print('section item purchased map', section_item_purchased_map)
    #         # for i in item_purchased:
    #         #     if item_purchased[i] != 0:
    #         #         print(i,item_purchased[i])
        
    #         # for i in item_needed:
    #         #     if item_needed[i] != 0:
    #         #         print(i, item_needed[i])
    #     path_values = sorted(path)
    #     print('path values', path_values)

    #     #path by sections and items
    #     instructions = []
    #     for value in path_values:
    #         section = path[value]
    #         section_item_dict = {}
    #         section_item_dict['value'] = value
            
    #         # does_section_exist = 
    #         if section in section_item_purchased_map:
    #             section_item_dict["section"] = section
    #             section_item_dict["items"] = section_item_purchased_map[section]
    #         else:
    #             section_item_dict["section"] = section
    #             section_item_dict["items"] = []
    #         # print(section_item_dict)
    #         instructions.append(section_item_dict)
    #     print('********************* INSTRUCTIONS **************************')
    #     print(instructions)
            
    #         # print('section is', section)
    #     return {'instructions':instructions}
    if m.status == gp.GRB.OPTIMAL:
        print('OPTIMAL OBJECTIVE TIME') 
        
        optimal_time_minutes = round(m.objVal*5/60, 2)
        print(optimal_time_minutes)
        print(item_purchased)
        # print(item_needed)
            # for i in item_purchased:
            #     if item_purchased[i] != 0:
            #         print(i,item_purchased[i])
        section_item_purchased_map = {}
        for item in item_purchased:
            section = item_sections[item]
            print('item', item, 'section', section)
            if section in section_item_purchased_map:
                section_item_purchased_map[section].append(item)
            else:
                section_item_purchased_map[section] = [item]
        print('section item purchased map', section_item_purchased_map)
        
        for (i,j) in order_of_visits:
            if order_of_visits[i,j].x != 0:
                print((i,j),order_of_visits[i,j].x)         
      
        
        visit_dict = {}
        for section in path:
            if section != 'Entry' and section != 'Exit':
                # print(p, path[p].x*section_visited[p].x)
                if path[section].x*section_visited[section].x !=0:
                    visit_dict[section] = path[section].x*section_visited[section].x     
                
            else:
                # print(p, path[p].x)
                visit_dict[section] = path[section].x*section_visited[section].x
                if section == 'Exit':
                    visit_dict['Exit']=26.0
        print('visit dict')
        print(visit_dict)
        order_list = sorted(visit_dict.items(), key=lambda x: x[1], reverse=False)
        print(order_list)
        output_list = []
        
        for section, value in order_list:
            print(section, value)
            # output_list.append(i[0])
            section_item_dict = {}
            section_item_dict['value'] = value
            if section in section_item_purchased_map:
                section_item_dict["section"] = section
                section_item_dict["items"] = section_item_purchased_map[section]
            else:
                section_item_dict["section"] = section
                section_item_dict["items"] = []
            output_list.append(section_item_dict)
            
        return {'instructions':output_list, 'time': optimal_time_minutes}
        # return {'item_purchased': item_purchased, 'item_needed': item_needed, 'sections_visited': sections_visited, 'order_of_visits': order_of_visits, 'recipe_complete': recipe_complete}
        
grocery_list = [['Soy flour, full-fat, roasted', 'Pie, coconut custard, commercially prepared']]
print('ultimate result:', optimize(grocery_list))