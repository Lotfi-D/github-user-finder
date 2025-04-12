import config from "../config"

const GithubService = {
  // I decided to Keep page & perPage at GitHub API defaults (page=1, per_page=30)
  searchUsers(userName: string, page = 1, perPage = 30) {
    const {baseUrl, endpoints} = config.api
    return fetch(`${baseUrl}${endpoints.searchUsers}${userName}&per_page=${perPage}&page=${page}`);
  }
}

export default GithubService
