import 'semantic-ui-css/semantic.min.css';    // enable beautiful styling of the form elements
import './App.css';
import {AuthContextProvider} from './context/auth-context';
import AppRouter from './AppRouter';



// After creation of a new react project which installs latest version 19.0.0, it was not compactible with some
// of the modules (e.g. semantic-ui-react), so I install lower version of react with npm using the command:
// npm install react@18.2.0 react-dom@18.2.0
// "react-router-dom" for handling routing should also be installed after creating a new react project

// THE GENERAL OR MAIN PAGE WHERE ROUTING IS PERFORMED
function App() {  
  // The <div> tag is the main container for all the contents of the web page
  // "element" or "Component" is used to specify the page to load with the route.

  // ":productId" inner route enable getting the product page through path such as "/product/23"

  // uses the called "AuthContextProvider" function as a tag to wrap the <AppRouter> which contains
  // all the routes so that the stored states and functions can be accessible everywhere in the project.
  
  return (
    <AuthContextProvider>      
      <AppRouter/>
    </AuthContextProvider>    
  );
}

export default App;
