
# 15.066 Optimization Final Project - Grocery Shopping Path Optimzer - Angelica

This directory contains the final project for Team 7 - The Well Made Heptade consisting of Inigo de Palacio, Elizabeth Hau, Luke Higgins, Wren Jiang, Andrew Tindall, and Lampros Tsonzos

## Angelica - Shop Efficient, Shop Intelligent

### Motivation

* COVID–19 has impacted how we shop for groceries​
* Critical to prioritize items needed​
* Meet nutritional requirements
* ​Reduce exposure time​
* Bottom up consumer-based approach

### Overview
* Objective: minimize exposure to COVID-19 by minimizing time in store​
* Subject to:​
  * Satisfying dietary requirements (minimum protein, fat, carbs, sugar, calories)​
  * Satisfying utility needs​

​Angelica will figure out:​
* Which sections to visit​
* In which order to visit them
* ​What items to buy in the sections visited​
* Total time spent in-store

### Project Structure

* `api` folder contains the actual API endpoint the front-end calls when users submit the grocery form
  * `optimze.py` is the python endpoint hit by the front-end that calls the optimization logic
  * `optimization_helper.py` contains all the optimization logic
* `data` folder has all the static data used in the project, which includes all the grocery items, their respective nutritional data and the distances between the various sections in the grocery store
* `src` contains the React code used to build the front-end
