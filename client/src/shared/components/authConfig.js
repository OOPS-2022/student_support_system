 
// Config object to be passed to Msal on creation.
// For a full list of msal.js configuration parameters, 
// visit https://azuread.github.io/microsoft-authentication-library-for-js/docs/msal/modules/_authenticationparameters_.html
const msalConfig = {
  auth: {
    clientId: "aa316400-4077-461b-b189-0a164a322bd1",
    authority: "https://login.microsoftonline.com/4b1b908c-5582-4377-ba07-a36d65e34934",
    redirectUri: "http://localhost:3000/",
  },
  cache: {
    cacheLocation: "sessionStorage", // This configures where your cache will be stored
    storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
  }
};  
  
// Add here the scopes to request when obtaining an access token for MS Graph API
// for more, visit https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-core/docs/scopes.md
const loginRequest = {
  scopes: ["openid", "profile", "User.Read", "Calendars.ReadWrite"]
};

// Add here scopes for access token to be used at MS Graph API endpoints.
const tokenRequest = {
  scopes: ["Calendars.ReadWrite"]
};

module.exports = {msalConfig , loginRequest, tokenRequest }