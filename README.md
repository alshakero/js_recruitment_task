# JS Recruitment Task

## Description
A quick solution for https://github.com/startupdevhouse/js_recruitment_task


## Running the app

- Clone this repository.
- Run `yarn` or `npm i` in its dir.
- Run `yarn dev` or `npm start dev`.

## Testing the app

I wrote 10 primitive tests just to make a point. I didn't use any libs as required. I just created `assert`, `assertEqual`, and `desribe` utilities to help me test. Break anything in the app and you should see the respective tests failing.  

### To run the tests
 
- Run `yarn test` or `npm run test` 
- Go to [http://localhost:5000/test](http://localhost:5000).

#### Small note:
This is not a proper way to test an app. There are many amazing libs out there. So please don't judge the quality of my code from the `test` folder. I think only the app code is representative of my code quality. 

## IE support
I didn't put any effort in supporting IE. Because `fetch` is recommended and IE doesn't support `fetch`. So I dropped it.

## Animations
I understand they're not requirements. But I wanted my demo to stand out. Read-Later flying animation is lovely and its code is clean (6 lines of code) but only works in FF and Chromium browsers. It renders nicely in other browsers but without the flying animation, only fades in.

## File structure

Since Parcel is setup, I cut my code into three modules:
- `utils.js`: has all the utility functions I use around the app.
- `readLaterStore.js` takes care of storing, loading, and rendering read-later articles.
- `main.js` the entry point 

The reason is for easier readiblity and maintenance. 

## Using `localStorage`

I understand that `localStorage` is not recommended these days due to performance issues. But since all their logic is in one place (`readLaterStore.js`) it's easy to replace it with any other API. I just like how simple and straight forward `localStorage` is, and I didn't see the task as something about data 
persistence performance. 

## Quick view

You can view the app quickly using GH pages [here](https://alshakero.github.io/js_recruitment_task/).


## Acknowledgement 

I liked the task description and the requirements are clear. I also appreciate taking care of the CSS and HTML. Saved me some time for sure. Thanks.
