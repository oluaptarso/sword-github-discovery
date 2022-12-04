import type { IGitHubRepository } from "@/interfaces/github-repository";
import axios from "axios";

const gitHubAxiosAPI = axios.create({
  baseURL: "https://api.github.com/",
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_APP_GITHUB_TOKEN}`,
    Accept: "application/vnd.github+json",
  },
});

export const mapFromGitHubApiItem = (item: any): IGitHubRepository => {
  return { nodeId: item.node_id, fullName: item.full_name, url: item.html_url } as IGitHubRepository;
};

export default gitHubAxiosAPI;
