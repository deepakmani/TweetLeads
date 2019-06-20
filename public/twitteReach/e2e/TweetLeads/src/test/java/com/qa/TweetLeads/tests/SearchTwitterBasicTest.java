package com.qa.TweetLeads.tests;
import org.testng.annotations.Test;

import org.testng.annotations.BeforeTest;
import com.qa.TweetLeads.pages.TwitterStreamsPage;
import com.qa.TweetLeads.base.SearchQuery;
import org.testng.Assert;
import com.qa.TweetLeads.base.*;

public class SearchTwitterBasicTest extends TestBase {
	TwitterStreamsPage page;
	SearchQuery search_query;
	int count; 
	String tweet_text_1;
	
	// Get driver properties
	public SearchTwitterBasicTest(SearchQuery s, int count, String tweet_text_1) {
		super();
		this.search_query = s;
		this.count 		  = count;
		this.tweet_text_1 = tweet_text_1;
		
	}
	
	// Visit URL
	@BeforeTest 
	public void setup() {
	
	  super.initialize();
	  page = new TwitterStreamsPage(); 
	  page.search_twitter(search_query);
	}
	
	@Test
	public void verify_spinner_is_displayed() {
		boolean displayed = page.verify_searching_spinner_is_displayed();
		Assert.assertTrue(displayed);
	}
	@Test
	public void verify_tweet_count_is_displayed() {
		String actual_tweet_count 	= page.get_tweet_count();
		String expected_tweet_count = this.count + " Tweets";
		Assert.assertEquals(actual_tweet_count, expected_tweet_count);
	}
	
}
