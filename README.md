
# Deviget challenge demo

**Overview: **

This is the deliverable source for the Deviget challenge assignment. Behind, some details of the application project will be provided, regarding project structure, different libraries and tools that were used and a wide range of techincal aspects that were considered while implementing the application. Moreover, it will be explained different steps to run the app locally and information about the release deployment on the cloud.

***Libraries and tools used

The app was developed as a SPA in React 17 + Typescript 4 using Node Package Manager 6 (NPM) as a dependency management tool. Other tools were used:
*	SASS as a CSS preprocessor
* Jest to unit test the UI components
*	Enzyme to navigate over the UI components DOM tree and to compare the model values with the rendered values in the output DOM.
*	Ts linter and prettier to promote code quality assurance
* Material-UI as a UI framework 
Under React language, it was used the React Hooks variant (not class components).

***Project structure*** 

The project consists of many project folders. The root folder contains files for installing dependencies (package.json), configuration files for typescript, eslinters and jest testing framework. The source files are included under src folder. This folder contains the follwoing set of files/folders:
* classes: Includes classes, interfaces and enums used by components and services
* components: Includes different presentational and container components of the app.
* mocks: Includes service mocks to be provided to test instances
* services: Includes services to get posts from the backend (reddit dev api) and to store the user's post data on browser's local storage.
* state. Contains files to handle state management adderessed by redux library.

Three main components compund the application: Post component, PostDetail component and PostList component.
* Post component: Renders a post basic data 

***Tests implemented***

For the applications, it was implemented three tests: Post.test, PostDetail.test and PostList.test.

***Run app in dev mode and run tests***

Prerequisites to run the frontend.
* NPM ^6.0 installed

To run the frontend app:
1.	Open a terminal and point to the frontend directory
2.	Run *npm install*. This command will generate all the project dependencies in the node_modules folder.
3.	If you want to run the app in a browser, type *npm run start* and it will be launched by webpack dev server in the url http://localhost:3000.
4.	If you want to build the app for a production environment, type *npm run build* and sources will be generated under ‘build‘ folder.

To run tests:
1.	Open a terminal and point to the frontend directory
2.	Run *npm run test*. 
3.	Test results will be displayed in the console output. In addition to that, a coverage html files will be generated under 'coverage' folder on the project root path.


### Considerations

* The tests are located in source files with name matching pattern **.test.tsx.
* The frontend app will retrieve data from the beers endpoint url parameter in the environment files.


## Some tasks remaining
1.	Unit test for some remaining components, such as the ErrorModal component. 
2.	Add some tests to test border use cases
3. Add a coverage analysis tool to get code coverage data after running tests
