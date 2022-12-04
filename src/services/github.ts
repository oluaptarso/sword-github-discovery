import type { IGitHubRepository } from "@/interfaces/github-repository";
import type { IGetRepositoriesInput, IGetRepositoriesOutput } from "@/interfaces/github.service";
import type IGitHubService from "@/interfaces/github.service";

import axios, { type AxiosInstance } from "axios";

class GitHubService implements IGitHubService {
  private gitHubAxiosAPI: AxiosInstance;

  constructor(axiosInstance: AxiosInstance | null = null) {
    if (axiosInstance) {
      this.gitHubAxiosAPI = axiosInstance;
    } else {
      this.gitHubAxiosAPI = axios.create({
        baseURL: "https://api.github.com/",
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_APP_GITHUB_TOKEN}`,
          Accept: "application/vnd.github+json",
        },
      });
    }
  }

  async getRepositories(input: IGetRepositoriesInput): Promise<IGetRepositoriesOutput> {
    const response: IGetRepositoriesOutput = {
      success: true,
    };

    try {
      const apiResponse = await this.gitHubAxiosAPI.get("search/repositories", {
        params: {
          q: `language:${input.type}`,
          sort: input.sort,
          page: input.page,
          per_page: input.perPage || 10,
        },
      });

      response.repositories = apiResponse.data.items.map(this.mapFromGitHubApiItem);
    } catch (e: any) {
      response.success = false;
      response.error = e;
    }

    return response;
  }

  mapFromGitHubApiItem(apiItem: any): IGitHubRepository {
    return { nodeId: apiItem.node_id, fullName: apiItem.full_name, url: apiItem.html_url } as IGitHubRepository;
  }
}

export default GitHubService;
