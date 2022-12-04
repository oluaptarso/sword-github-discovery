import type { GitHubDiscoverySorts, GitHubDiscoveryTopics } from "@/types/github-discovery-constants";
import type { AxiosError } from "axios";
import type { IGitHubRepository } from "./github-repository";

export interface IGetRepositoriesInput {
  type: GitHubDiscoveryTopics;
  page: number;
  sort?: GitHubDiscoverySorts;
  perPage?: number;
}

export interface IGetRepositoriesOutput {
  success: boolean;
  repositories?: IGitHubRepository[];
  error?: AxiosError;
}

export default interface IGitHubService {
  getRepositories: (input: IGetRepositoriesInput) => Promise<IGetRepositoriesOutput>;
  mapFromGitHubApiItem: (apiItem: any) => IGitHubRepository;
}
