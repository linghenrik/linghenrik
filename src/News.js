import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {Link} from 'react-router-dom';

import { Query } from 'react-apollo';
import gql from 'graphql-tag';


const NEWS_LIST_QUERY = gql`
  query newsList($skip: Int! $limit: Int!) {
    newsList(skip: $skip  limit: $limit) {
	    totalRows
	    rows {
	      id
	      title
	      url
	      img
	      content
	    }
	  }
  }
`;

const NEWS_ITEM_QUERY = gql`
  query newsItem($id: ID !) {
    newsItem(id: $id ) {
    	id
	    title
	    content
	    img
	    url
	  }
  }
`;



const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      maxWidth: 345,
      margin: '2%',
    },
    media: {
      height: 0,
      paddingTop: '56.25%', // 16:9
    }
  }),
);


export default function News(props) {


	const back = <Link to="/"><Button size="small" color="primary">
	                            Back
	                          </Button></Link>;

	function More(props) {
	  const id = props.id;
	  return <Link to={"/news/"+id}><Button size="small" color="primary">
	                            Read More
	                          </Button></Link>;
	}

	function Source(props) {
	  const url = props.url;
	  return <a href={url}><Button size="small" color="primary">
	                            Source
	                          </Button></a>;
	}                         

	  const classes = useStyles();


	  if (props.match ) {
	  	var id = props.match.params.id;
	  	
	  	return (
	    <Query query={NEWS_ITEM_QUERY} variables={{id}} >
		    {({ loading, error, data }) => {
		      if (loading) return "Loading...";
		      if (error) return `Error! ${error.message}`;

		      if (data) return (
		                <Card className={classes.card} key = {data.newsItem.id} >
		                  <CardMedia 
		                  	className={classes.media}

		                    image={data.newsItem.img}
		                    title="News image"
		                  />
		                  <CardContent>
		                    <Typography gutterBottom variant="h5" component="h2">
		                      {data.newsItem.title}
		                    </Typography>
		                    <Typography paragraph variant="body2" color="textSecondary">
	                                  {data.newsItem.content}
	                                </Typography>
		                  </CardContent>
		                  <CardActions>
	                          <Source url={data.newsItem.url} />
	                          {back}
	                       </CardActions>
		                </Card>
		      );
		    }}
		  </Query>
	  	);
	  } else if (props.limit ) {
	  var skip = props.skip;
	  var limit = props.limit;
	  	return (
	    <Query query={NEWS_LIST_QUERY} variables={{skip, limit}} >
		    {({ loading, error, data }) => {
		      if (loading) return "Loading...";
		      if (error) return `Error! ${error.message}`;

		      if (data) return (
		          data.newsList.rows.map(news => (
		                <Card className={classes.card} key={news.id}>
		                  <CardMedia 
		                  	className={classes.media}
		                    image={news.img}
		                    title="News image"
		                  />
		                  <CardContent>
		                    <Typography gutterBottom variant="h5" component="h2">
		                      {news.title}
		                    </Typography>
		                  </CardContent>
		                  <CardActions>
	                          <Source url={news.url} />
	                          <More id={news.id} />
	                        </CardActions>
		                </Card>
		          ))
		      );
		    }}
		  </Query>
	  	);
	  }

	  
}