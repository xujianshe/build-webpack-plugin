This file contains guidelines that should be followed when making any changes to the repository. All text before the first level 1 (L1) header will be ignored by the Pull request guidelines add-on.

# Tech Review Meta Rules

## Program runtime review first, then code review

## If you break any item of tech review checklist, you should explain to your reviewer and add comment in code to tell why you do that

# Frontend - Runtime

**Runtime First**

**Modify this part without permission from WIN team is not acceptable!**

## Get permission from WIN team if you need to write Cookie/Storage

## No none-Seismic-resources in http tranfic

## Make sure API call sequence are correct, ensure they are the right API to use

# Code review – common part

**Modify this part without permission from WIN team is not acceptable!**

## A method should not have more than 100 lines.

## A source file should not have more than 1000 lines.

## One source file should only have one public class, file name should match the public class name.

## Do not change any data in read only property and read only method.

## No duplication code.

## Do not using names that conflict with words widely used in programming language and common library (e.g. named a key as "key" in config file, named your variable as "Public", named your class as "Map"). Do not create your own abbreviation which is not in English dictionary.

## Do not write code which complexity is equal O(n2) or greater than O(n2), try to optimized the complexity to O(n log(n)), O(n), O(log(n)) or O(1).

Note: if your code execute sequential search in two nested loop, the algorithm complexity is O(n2). Below snippet is O(n2), suppose length of sequenceA is 10,000, length of sequenceB also is 10,000, the code run 10,000,000 iterations in worst case.

## Do not programming from scratch if existed code has already done most of things you want to do. Try to do refactor to make it better.

Note: Make sure you really understand the old code, really understand the tricky part and what side effect it solved. Do not think casually the old code is just a mess garbage and you can get a better one from scratch. 

# Frontend - React

**Modify this part without permission from WIN team is not acceptable!**

## Never mutate state/props directly

## Never hide useless DOMs in a list (just don't render it)

## No arrow function or bind in jsx (or implied)

## Never operate DOM directly

## No copy prop into state

## Choose id as key in list
 
# Frontend - CSS/SCSS

**Modify this part without permission from WIN team is not acceptable!**

## No id selector, no tag selector

## No general name for class selector

## No !improtant

## Wrap selector with namespace
 
# Frontend - Documents

**Modify this part without permission from WIN team is not acceptable!**

## Update JSDoc/OnlineSample/README/CHANGELOG

