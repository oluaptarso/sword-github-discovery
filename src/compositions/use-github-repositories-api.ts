import { ref } from "vue";
import type { GitHubDiscoverySorts, GitHubDiscoveryTopics } from "@/types/github-discovery-constants";
import type { IGitHubRepository } from "@/interfaces/github-repository";
import GitHubService from "@/services/github";

const gitHubService = new GitHubService();

export default async function useGitHubRepositoriesAPI(type: GitHubDiscoveryTopics, page: number = 1, sort?: GitHubDiscoverySorts) {
  const error = ref<Error | null>(null);
  const loading = ref(true);
  const repositories = ref<IGitHubRepository[]>([]);

  const fetch = async (type: GitHubDiscoveryTopics, page: number = 1, sort?: GitHubDiscoverySorts) => {
    loading.value = true;
    const response = await gitHubService.getRepositories({ type, page, sort });
    loading.value = false;

    if (response.success && response.repositories) {
      repositories.value = response.repositories;
    } else {
      error.value = response.error as Error;
    }
  };

  const reFetch = (type: GitHubDiscoveryTopics, page: number = 1, sort?: GitHubDiscoverySorts) => {
    fetch(type, page, sort);
  };

  fetch(type, page, sort);

  return {
    reFetch,
    error,
    loading,
    repositories,
  };
}
