import React, { Component } from "react";
import axios from "axios";
import './search.css';
import oauthSignature from 'oauth-signature';

class Search extends Component {
  // searchAPI = 'https://www.themealdb.com/api/json/v1/1/search.php';
  searchAPI = 'https://api.twitter.com/1.1/search/tweets.json?oauth_consumer_key=w2USKpLcIw6MEWJfXngli6f8T&oauth_token=179807117-5UDyBQwzTiuhX3v6qPpKmOzsqhZwzRLldtjrnWqS&oauth_signature_method=HMAC-SHA1&oauth_timestamp=1574875580&oauth_nonce=0yUGmC&oauth_version=1.0&oauth_signature=zsoJQYJh1c2Ck0KLiVxgXQTPYtE%3D&result_type=mixed&count=2';
  state = {
    searchValue: '',
    isSearchPerformed: false,
    meals: []
  };

  onSearchChange = event => {
    this.setState({ searchValue: event.target.value });
  };

  search = () => {
    this.fetchTweets(this.state.searchValue);
  };

  clearSearch = () => {
    this.setState({ searchValue: '' });
  };

  fetchTweets = async searchInput => {
    const options = {
      url: `/1.1/search/tweets.json?${this.getQueryParams()}&q=${escape(searchInput)}&result_type=mixed&count=10`,
      method: 'GET',
      headers: { 'cache-control': 'no-cache' },
    };

    const response = await axios(options);

    debugger;
  };

  generateOauthSignature = () => {
    var httpMethod = 'GET',
      url = 'https://api.twitter.com/1.1/search/tweets.json',
      parameters = {
        oauth_consumer_key: process.env.REACT_APP_oauth_consumer_key,
        oauth_token: process.env.REACT_APP_oauth_token,
        oauth_nonce: process.env.REACT_APP_oauth_nonce,
        oauth_timestamp: '1574878855',
        oauth_signature_method: 'HMAC-SHA1',
        oauth_version: '1.0'
      },
      consumerSecret = process.env.REACT_APP_consumer_secret,
      tokenSecret = process.env.REACT_APP_token_secret,
      // generates a RFC 3986 encoded, BASE64 encoded HMAC-SHA1 hash
      encodedSignature = oauthSignature.generate(httpMethod, url, parameters, consumerSecret, tokenSecret, { encodeSignature: true })

    return 'ss0%2FJowjs9Sfjc1LPLPGkCcdi%2Fs%3D'
    return encodedSignature;
  }

  getQueryParams = () => {
    const queryParams = [
      'oauth_consumer_key',
      'oauth_token',
      'oauth_signature_method',
      'oauth_timestamp',
      'oauth_nonce',
      'oauth_version',
      // 'result_type',
      // 'count'
    ];

    let queryParam = '';
    queryParams.forEach((param, i) => {
      queryParam += `${i === 0 ? '' : '&'}${param}=${process.env[`REACT_APP_${param}`]}`
    });

    return queryParam + `&oauth_signature=${this.generateOauthSignature()}`;
  }

  fetchMeals = async searchInput => {
    const searchUrl = `${this.searchAPI}?s=${searchInput}`;
    // fetch(searchUrl)
    //   .then(response => {
    //     return response.json();
    //   })
    //   .then(jsonData => {
    //     this.setState({ meals: jsonData.meals || [], isSearchPerformed: true });
    //   });

    const res = await axios(searchUrl, { method: 'GET' });
    this.setState({ meals: res.data.meals || [], isSearchPerformed: true })
  };

  render() {
    return (
      <div>
        <h1>Meal Search App</h1>
        <input
          name="text"
          type="text"
          placeholder="Enter something to search"
          onChange={event => this.onSearchChange(event)}
          value={this.state.searchValue}
        />
        <button onClick={this.search}>Search</button>
        <button onClick={this.clearSearch}>Clear Search</button>
        <div>
          {this.state.meals.map((meal, index) => (
            <div key={index}>
              <h2>{meal.strMeal}</h2>
              <img src={meal.strMealThumb} />
            </div>
          ))}
        </div>
        <p>{this.state.meals.length === 0 && this.state.isSearchPerformed === true ? 'No data found' : ''}</p>
      </div>
    );
  }
}

export default Search;