package com.qa.TweetLeads.pages;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.WebDriverWait;
import com.qa.TweetLeads.base.*;

public class TwitterStreamsPage extends TestBase {
	By search_twitter_input_xpath = By.xpath("//div[@id='search-twitter']//input[@id='search-twitter-keyword']");
	WebElement search_twitter_input;
	
	By search_twitter_button_xpath = By.xpath("//div[@id='search-twitter']//button[@id='search-twitter']");
	WebElement search_twitter_button;
	
	WebElement exclude_retweets;
	By exclude_retweets_xpath = By.xpath("//div[@id='search-twitter']//input[@type='checkbox'and @id ='exclude-retweets']");
	
	WebElement exclude_links;
	By exclude_links_xpath = By.xpath("//div[@id='search-twitter']//input[@type='checkbox'and @id ='exclude-links']");
	
	
	WebElement searching_spinner;
	By searching_spinner_xpath = By.xpath("//div[@id='search-twitter']//*[@class='fa fa-spinner fa-spin']");
	
	WebElement tweet_count_text;
	
	
	public TwitterStreamsPage() {
		// Initialize Driver
		
		super();
		
		// load elements
		this.find_elements();
	}
	
	public void find_elements() {
		search_twitter_input 	= driver.findElement(search_twitter_input_xpath);
		search_twitter_button 	= driver.findElement(search_twitter_button_xpath); 
		exclude_retweets 		= driver.findElement(exclude_retweets_xpath);
		searching_spinner 		= driver.findElements(searching_spinner_xpath).size() > 0 ? driver.findElement(searching_spinner_xpath) : null;
	}	
	
	public void search_twitter(SearchQuery search_query) {
		String keyword = search_query.keyword;
		search_twitter_input.sendKeys(keyword);
		if(exclude_retweets.isSelected() && !search_query.exclude_retweets)
			exclude_retweets.click();
//		
//		if(exclude_links.isSelected() && !search_query.exclude_links)
//			exclude_links.click();
//		
		
		search_twitter_button.click();
		
	}
	
	public boolean verify_searching_spinner_is_displayed() {
		if (searching_spinner != null)
			return searching_spinner.isDisplayed(); 
		else return false;
	}
	
   public String get_tweet_count() {
	   By tweet_count_text_xpath = By.xpath("//div[@id='search-twitter']//*[@id='tweet-count']");
		tweet_count_text 		= driver.findElement(tweet_count_text_xpath);

	   return tweet_count_text.getText();
   }
}
