import React from 'react';
import ReactDOM from 'react-dom';
import InfiniteScroll from "react-infinite-scroll-component";
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from 'react-apollo';
import News from './News'; 
import * as serviceWorker from './serviceWorker';
import Container from '@material-ui/core/Container';


const client = new ApolloClient({
  link: new HttpLink({ uri: "https://news-reader.stagnationlab.dev/graphql" }),
  cache: new InMemoryCache(),
});


const Notfound = () => <h1>Not found</h1>;
 

class App extends React.Component {

  state = {
    items: Array.from({ length: 3 })
  };


  fetchMoreData = () => {
      this.setState({
        items: this.state.items.concat(Array.from({ length: 2 }))
      });

  };

  render() {
    return (
      <div>
        <Typography variant="h3" align="center">All the good news for you</Typography>
        <hr />
        <InfiniteScroll
          dataLength={this.state.items.length}
          next={this.fetchMoreData}
          hasMore={true}
          loader={<Typography align="center" variant="h4">Loading...</Typography>}
        >	<Container >
        	{this.state.items.map((i, index) => (
        		<Grid container key={index} justify="center" >
		        	<Grid item>

				          <News skip = {index} limit={1} />

			        </Grid>
		        </Grid>
		    ))}
		    </Container>
        </InfiniteScroll>
      </div>
    );
  }
}

const routing = (
  <Router>
    <div>
    	<Switch>
	      <Route exact path="/" component={App} />
	      <Route path="/news/:id" component={News} />
	      <Route component={Notfound} />
		</Switch>
    </div>
  </Router>
)

ReactDOM.render(<ApolloProvider client={client}>{routing}</ApolloProvider>, document.getElementById("root"));
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
