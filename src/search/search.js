import React, { Component } from "react";
import axios from "axios";
import './search.css';

class Search extends Component {
  DATE_OPTIONS = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
  state = {
    searchValue: '',
    isSearchPerformed: false,
    tweets: [],
    recentSearches: [],
    accessToken: '',
    hashTags: {},
    isLoading: false
  };

  async componentDidMount() {
    const response = await this.getAccessToken();
    this.setState({ accessToken: response.data.items })
  }

  getAccessToken = async () => {
    return axios('/api/accessToken/', { method: 'GET' })
  }

  onSearchChange = event => {
    this.setState({ searchValue: event.target.value });
  };

  search = async () => {
    const lastSearch = this.state.recentSearches.length ? this.state.recentSearches[this.state.recentSearches.length - 1] : '';
    if (this.state.searchValue.trim() && lastSearch !== this.state.searchValue) {
      this.state.recentSearches.push(this.state.searchValue);
      this.setState({ isLoading: true });
      await this.fetchTweets(this.state.searchValue);
    }
  };

  clearSearch = () => {
    this.setState({ searchValue: '' });
  };

  fetchTweets = async searchInput => {
    const options = {
      url: `api/tweets?accessToken=${this.state.accessToken}&q=${escape(searchInput)}`,
      method: 'GET',
    };

    try {
      const response = await axios(options);
      const hashTags = this.getRankedHashTags(response.data.items);
      this.setState({
        tweets: response.data.items || [],
        hashTags: hashTags,
        isSearchPerformed: true,
        isLoading: false
      });
    } catch (error) {
      this.setState({ tweets: [], isSearchPerformed: true, searchValue: '' });
    }
  };

  getRankedHashTags = items => {
    let hashtagsList = {};
    items.map((item) => {
      if (item.entities.hashtags.length) {
        item.entities.hashtags.forEach(tag => {
          hashtagsList[tag.text] = hashtagsList[tag.text] ? hashtagsList[tag.text] + 1 : 1;
        });
      }
    });
    return hashtagsList;
  };

  render() {
    return (
      <div>
        {
          this.state.accessToken ?
            <div>
              <h1>Tweets Search App</h1>
              <input
                name="text"
                type="text"
                placeholder="Enter something to search"
                onChange={event => this.onSearchChange(event)}
                value={this.state.searchValue}
              />
              <button onClick={this.search}>Search</button>
              <button onClick={this.clearSearch}>Clear Search</button>
            </div> : 'Loading App...'
        }
        {
          !this.state.isLoading ?
            <div>{
              this.state.tweets.length || this.state.isSearchPerformed ?
                <div className="search-list">
                  <h2>Search Results</h2>
                  <ul>
                    {this.state.tweets.map((tweet, index) => (
                      <li key={index}>
                        <h4>{(new Date()).toLocaleDateString('en-US', this.DATE_OPTIONS)}</h4>
                        <span>{tweet.text}></span>
                      </li>
                    ))}
                    <p>{this.state.tweets.length === 0 && this.state.isSearchPerformed === true ? 'No data found' : ''}</p>
                  </ul>
                </div> : null
            }
            </div> : 'Searching...'
        }
        {
          this.state.recentSearches.length ?
            <div className="recent-search-list">
              <h2>Recent Searches</h2>
              <ul>
                {this.state.recentSearches.map((search, index) => (
                  <li key={index}>{search}</li>
                ))}
              </ul>
            </div> : null
        }
        {
          !this.state.isLoading && Object.keys(this.state.hashTags).length ?
            <div className="hashtag-list">
              <h2>Ranked HashTags</h2>
              <ul>
                {Object.keys(this.state.hashTags).map((tag, index) => (
                  <li key={index}>{tag + ': ' + this.state.hashTags[tag]}</li>
                ))}
              </ul>
            </div> : null
        }
      </div >
    );
  }
}

export default Search;