### 1.What is the difference between Component and PureComponent? Give an example where it might break my app.

 PureComponent implements a shouldComponentUpdate() method that performs a shallow comparison of the component's props and state, and only re-renders if there are differences, while Component always re-renders when its props or state change.

 Here's an example where it might break my app:
 ```
class App extends React.PureComponent {
   state = {
   items: [1, 2, 3]
   };

   handleClick = () => {
   const { items } = this.state;
   items.push(items.length + 1);
   this.setState({ items });
   };

render() {
   const { items } = this.state;
   return (
   <div>
      <button onClick={this.handleClick}>Add Item</button>
      {items.map(item => (
      <Item key={item} value={item} />
      ))}
   </div>
   );
   }
}

class Item extends React.PureComponent {
   render() {
   const { value } = this.props;
   return <div>{value}</div>;
   }
}
```
In this example, the App component is a PureComponent that renders a list of Item components. When the Add Item button is clicked, the App component updates its state to add a new item to the list. However, because Array.push() mutates the original array, the App component's shouldComponentUpdate() method incorrectly assumes that the props and state have not changed, and does not re-render. As a result, the new item is not added to the list. To fix this issue, you can either use Array.concat() to create a new array instead of mutating the original one, or switch App to extend Component instead of PureComponent.

### 2. Context + ShouldComponentUpdate might be dangerous. Why is that?

Using shouldComponentUpdate() with Context in React can be dangerous because it can lead to unexpected behavior and performance issues.

The shouldComponentUpdate() lifecycle method is used to control whether a component should re-render or not. It returns a boolean value that indicates whether the component should update or not. By default, React assumes that a component should re-render whenever its props or state change.

However, if a component uses Context, changes to the context can trigger re-renders of child components that use that context. This means that if a parent component implements shouldComponentUpdate() to optimize performance by avoiding unnecessary re-renders, it may cause child components to not receive updates from the context when they should.

To avoid this issue, it's generally recommended to avoid using shouldComponentUpdate() with Context, and instead rely on React's default behavior of re-rendering whenever props or state change. If you need to optimize performance, you can use techniques such as memoization or React.memo() to optimize the rendering of child components.

### 3. Describe 3 ways to pass information from a component to its PARENT

   1. Passing a callback function as a prop: A child component can pass data to its parent by calling a callback function that is passed to it as a prop. For example:

      ``` 
      function Child(props) {
         const handleClick = () => {
         props.onButtonClick('Button clicked!');
      };

      return (
      <button onClick={handleClick}>Click me</button>
      );
      }

      function Parent() {
         const handleChildClick = (message) => {
         console.log(message);
      };

      return (
      <Child onButtonClick={handleChildClick} />
      );
      }
      
      ```

   2. Using the useState hook and passing a setter function as a prop: A child component can also use the useState hook to manage its own state, and pass a setter function for that state as a prop to the parent component. For example:

   ```
   function Child(props) {
   const [count, setCount] = useState(0);

   useEffect(() => {
   props.onCountChange(count);
   }, [count]);

   return (
   <button onClick={() => setCount(count + 1)}>Click me ({count})</button>
   );
   }

   function Parent() {
   const handleChildCountChange = (count) => {
   console.log(`Child count: ${count}`);
   };

   return (
   <Child onCountChange={handleChildCountChange} />
   );
   }
   ```

3. Context API: we can use the Context API in React to pass information from a child component to its parent component without having to pass props down through every level of the component tree. Here's an example:

```
   const MyContext = React.createContext();

      function Parent() {
      return (
      <MyContext.Provider value="Some data">
      <Child />
      </MyContext.Provider>
      );
      }

      function Child() {
      const data = React.useContext(MyContext);

      return <div>Data from parent: {data}</div>;
      }
 ```

we can use the useReducer hook along with context api to to have central state and update the central state by dispatching actions from any level of component.

### 4. Give 2 ways to prevent components from re-rendering.

1. Using useCallback hook along with React.memo higher order component in function components
2. Using shouldComponentUpdate in class based components

### 5. What is a fragment and why do we need it? Give an example where it might break my app.
   A fragment is a way to group together multiple children elements without adding an extra node to the DOM.
   
   Example:
   ```
   function MyComponent() {
   return (
      <>
         <div>Child 1</div>
         <div>Child 2</div>
         <div>Child 3</div>
      </>
   );
   }
   ```
   However, there are some cases where using fragments might break the app. For example, if we are using a library or a third-party component that relies on the structure of our markup, using a fragment might break the library or cause unexpected behavior.

### 6. Give 3 examples of the HOC pattern.

1. Styling HOC: HOCs can also be used to apply styles to a component.
   Example:
   ```
   function withStyle(Component, styles) {
   return function(props) {
   return <Component style={styles} {...props} />;
   };
   }
   
   const MyComponent = ({ style }) => {
   return <div style={style}>content</div>;
   };

   const styledComponent = withStyle(MyComponent, {
   backgroundColor: '#fafafa',
   color: '#fff',
   padding: '8px'
   });
   
   export default styledComponent;
   ```

2. Data fetching HOC: Another common use case for HOCs is to fetch data from an API and pass it as props to a component.
 
 Example:
 ```
function withDataFetching(Component, url) {
   return class extends React.Component {
            state = {
            data: null,
            isLoading: true,
            error: null
            };

          async componentDidMount() {
            try {
              const response = await fetch(url);
              const data = await response.json();
              this.setState({ data, isLoading: false });
            } catch (error) {
              this.setState({ error, isLoading: false });
            }
          }

    render() {
      return <Component {...this.props} {...this.state} />;
    }
};
}

const MyComponent = ({ data, isLoading, error }) => {
      if (isLoading) {
      return <div>Loading...</div>;
      }

      if (error) {
      return <div>Error: {error.message}</div>;
      }
return <div>Data: {data}</div>;
};

export default withDataFetching(MyComponent, 'https://api.example.com/data');
```

3. Authentication HOC: In a web application, it's often necessary to restrict certain pages or components to authenticated users. we can create an HOC that wraps a component and checks if the user is authenticated before rendering it. If the user is not authenticated, the HOC can redirect the user to the login page or display an error message.

Example:
```
function withAuth(Component) {
   return function(props) {
      const isAuthenticated = checkIfAuthenticated();
      if (isAuthenticated) {
      return <Component {...props} />;
      } else {
      return <Redirect to="/login" />;
      }
   };
}

   const MyComponent = () => {
   return <div>This component requires authentication</div>;
   };

export default withAuth(MyComponent);
```
### 7.  What's the difference in handling exceptions in promises, callbacks and async...await?

Promises: With Promises, we can use the .catch() method to handle any errors that occur during the execution of the Promise chain. If an error occurs in any of the previous Promises in the chain, the control is passed to the nearest .catch() block, allowing us to handle the error.

Example:
```
  someFunction()
  .then(result => {
      // Handle the result
  })
  .catch(error => {
      // Handle the error
  });
```

Callbacks: Error handling with callbacks usually involves passing an error object as the first argument to the callback function, along with any other results or data.

Example:
```
    callbackFunction((error, result) => {
        if (error) {
        // Handle the error
        } else {
        // Handle the result
        }
    });
    
```

Async/await: Async/await is a more modern way of handling asynchronous code in JavaScript. we can use the try/catch block to handle any errors that occur during the execution of the async function. If an error occurs, the control is passed to the nearest catch block, allowing us to handle the error.

Example:
```
    async function fetchData() {
        try {
            const result = await fetchProducts();
            // Handle the result
        } catch (error) {
            // Handle the error
        }
    }
```

### 8. How many arguments does setState take and why is it async.

setState takes two arguements first arguement is the state value and the second arguement is a callback function.

Example:

```
this.setState({ count: 1 }, () => {
console.log('State updated');
});
```

setState() is asynchronous, React guarantees that the updated state will eventually be applied to the component, even if there are multiple updates queued up.

### 9. List the steps needed to migrate a Class to Function Component.

1. Rewrite the component as a Function Component:

   * Remove the class keyword and extend React.Component
   * Replace the render() method with a function that returns the JSX code
   * Remove the this keyword and use function parameters instead to access props and state

2. Remove any lifecycle methods:

   * If the Class Component uses lifecycle methods such as componentDidMount, componentDidUpdate, componentWillUnmount, etc., they should be refactored to use React Hooks or side-effects within the Function Component.

3. Replace this.setState() with useState() Hook:

   * Use the useState() Hook to manage state variables in Function Components.
   * Define state variables using the useState() Hook and update them using the state update function returned by useState().

4. Replace this.props with function parameters:

5. Replace this.context with useContext() Hook:

   * Define the context using the createContext() method and wrap the Function Component with the Context.Provider component.

### 10. List a few ways styles can be used with components.

   * Inline styles
   * CSS Stylesheet
   * CSS modules
   * CSS-in-JS libraries like styled-components, Emotion, or Material-UI
   * Tailwind css

### 11. How to render an HTML string coming from the server.

We can render an HTML string that comes from the server by using the dangerouslySetInnerHTML attribute.

Example:
```
function MyComponent(props) {
   return <div dangerouslySetInnerHTML={{ __html: data }} />
}
```
