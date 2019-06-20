package com.qa.TweetLeads.base;

public class SearchQuery {
	
	public String 	keyword;
	public Boolean exclude_retweets;
	public Boolean exclude_links;
	public Boolean exclude_media;
	
	public SearchQuery(String keyword,Boolean exclude_retweets, Boolean exclude_links,Boolean exclude_media ) {
		this.keyword 			= keyword;
		this.exclude_links 		= exclude_links;
		this.exclude_retweets 	= exclude_retweets;
		this.exclude_media 		= exclude_media;
	}
}
