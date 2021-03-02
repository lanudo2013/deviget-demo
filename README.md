# Deviget challenge demo


This is the deliverable source for the Deviget challenge assignment. Behind, some details of the application project will be provided, regarding project structure, libraries and tools that were used and a wide range of techincal aspects that were considered while carrying out the implementation. Moreover, it will be explained different steps to run the app locally and information about the release deployment on the cloud.

## Libraries, APIs and tools used ##

The app was developed as a SPA in React 17 + Typescript 4 using Node Package Manager 6 (NPM) as a dependency management tool. The following tools/libraries were used: 
*	SASS as a CSS preprocessor
* Jest to unit test the UI components
*	Enzyme to navigate over the UI components DOM tree and to compare the model values with the rendered values in the output DOM.
*	Ts linter and prettier to promote code quality assurance
* Material-UI as the UI framework 
* Redux library for state management. Redux thunk library for dealing with async actions.

Under React language, it was used the React Hooks variant (not class components).

For local storage, it was used IndexedDB supported by most of the well-known browsers. It allows to create object stores similar to mongodb collection and it behaves as a non-relational databse. It was assessed as a better option than using the simple local storage API as it permits storing values in different data types and it offers a clear API to run CRUD operations over store records, while the other one only allows to store key-value string pairs.

## Project structure ##

The project consists of many project folders. The root folder contains files for installing dependencies (package.json), configuration files for typescript, eslinters and jest testing framework. The source files are included under src folder. This folder contains the following set of files/folders:
* classes: Includes classes, interfaces and enums used by components and services
* components: Includes different presentational and container components of the app.
* mocks: Includes service mocks to be provided to test instances
* services: Includes services to get posts from the backend (reddit dev api) and to store the user's post data on browser's local storage.
* state. Contains files to handle state management adderessed by redux library.

***Components***

Three main components compund the application: Post component, PostDetail component and PostList component.
* Post component: Renders a post basic data unit. It shows post title, thumbnail picture, author, creation date, number of comments and read status. This component becomes each post item in the post list component. Two actions can be done over the post: dismiss the post and save the post on the local storage.
* PostDetail component. This component is responsible for rendering the post content, according to different post types: Image, Video, Embed Video, Html or Link.
* PostList component. This componentes shows a list of Post components in a scrollable container. It renders options at the top to perform actions over posts. This actions allow to:
1. Set posts request page size
2. Reloading all posts from scratch
3. Dismiss all showing posts and 
4. Show saved posts 
Moreover, when sticking the scroll to bottom, the component triggers a new posts request to the server to fetch additional posts and concat the result at the end of the current list. It excludes the already dismissed posts from the result.

***Services***

Three main services were implemented for the application:
1. PostDBService. Runs operation over IndexedDB storage, such as retrieving read posts, saved posts, or inserting a new read post or a new dismissed post
2. PostHttpService. Create http requests for getting posts from reddit API. It also handles pagination matter.
3. PostService. Recieves request from components and coordinates data flows from PostDBService and PostHttpService.

***Tests implemented***

For the applications, it was implemented three tests: Post.test, PostDetail.test and PostList.test. Post.test and PostDetail.test are unit tests for Post component and PostDetail component respectively, while PostList.test is a integration test that tests all basic use cases of the app from user perspective.
Render snapshots of each component are included in the sources.

## Steps to run app in dev mode and run tests ##

Prerequisites to run the frontend.
* NPM ^6.0 installed

To run the frontend app:
1.	Open a terminal and point to the frontend directory
2.	Run *npm install*. This command will generate all the project dependencies in the node_modules folder.
3.	If you want to run the app in a browser, type *npm run start* and it will be launched in the url http://localhost:3000.
4.	If you want to build the app for a production environment, type *npm run build* and sources will be generated under ‘build‘ folder.

To run tests:
1.	Open a terminal and point to the frontend directory
2.	Run *npm run test*. (if you wish to reset snapshots, run *npm run test -- --u*)
3.	Test results will be displayed in the console output. 

In addition to that, a coverage html files will be generated under 'coverage' folder on the project root path.
The tests are located in source files with name matching pattern **.test.tsx. 

## Release deployment ##

The app was deployed on heroku cloud platform from built sources and running a http-server instance. The app can be accessed at https://deviget-demo.herokuapp.com/ .

## Future tasks pending ##
1. Create tests for handling exceptions that may arise from a http request or running statements on the IndexedDB.
2. Create E2E tests. Puppeter is a good tool candidate for this.
3. Improve stylization
