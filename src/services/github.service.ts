import config from "../config"
const GithubService = {
  getProfiles(userName: string) {
    const {baseUrl, endpoints} = config.api
    return fetch(`${baseUrl}${endpoints.searchUsers}${userName}`);
  }
}

export default GithubService
