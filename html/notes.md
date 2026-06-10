# General Notes
these notes exist to save information about backend/server-side processing, that was covered in the lectures, but not relevant yet in the code

## name attribute
```
html
name=""
```

the name tag in html allows
- grouping tags together for "mcq" style fields
- it helps the server find the field (in php)

## value attribute
```
html
value=""
```
for some fields, the value isn't entered by the user, so we add the value to the tag, so it gets sent to the server when selected. simple dimple

## action attribude
```
html
action=""
```
not used yet, but basically decides what happens to the data from the form after it is submitted. the data of the form, goes into the url and is sent to the server using https.

## validation
the types automatically do some validation, thanks to html5. like email etc. need to add some attributes for others like `required`