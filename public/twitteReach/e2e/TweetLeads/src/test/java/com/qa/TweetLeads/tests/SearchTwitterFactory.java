package com.qa.TweetLeads.tests;

import  com.qa.TweetLeads.tests.SearchTwitterBasicTest;

import org.testng.annotations.Test;
import org.testng.annotations.BeforeTest;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Factory;

import com.qa.TweetLeads.pages.TwitterStreamsPage;
import com.qa.TweetLeads.base.SearchQuery;
import org.testng.Assert;


public class SearchTwitterFactory {

   
	
	// Create data provider	
	 @DataProvider(name="get_twitter_search_queries")
	    public Object[][] get_twitter_search_queries(){
		    return new Object[][] 
		    {
		    	 
		    	// Keyword, count, first tweet text, last tweet text
		    	{new SearchQuery("Amma Bhagavan", true, true, true), 5, "a"}, 
		    	{new SearchQuery("Oneness University", true, true, true), 100, "a"},
		    	{new SearchQuery("ShriDevi", true, true, true), 100, "a"}
		    	
		    };
	 }
	 
	 @Factory(dataProvider= "get_twitter_search_queries")
	    public Object[] factoryMethod(SearchQuery s, int count, String text1) {
	        return new Object[] {
	                                new SearchTwitterBasicTest(s, count, text1)
	                            };
	    }
}	
