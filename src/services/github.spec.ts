import GitHubService from "./github";
import { describe, expect, expectTypeOf, test, vi } from "vitest";
import type IGitHubService from "@/interfaces/github.service";
import axios from "axios";
import GitHubGetRepositoriesMockData from "@/mocks/github-get-repositories.data";

vi.mock("axios");

describe("GitHubService", async () => {
  const ax = await vi.importActual<typeof axios>("axios");

  const axiosInstance = ax.create({
    baseURL: "https://api.github.com/",
    headers: {
      Accept: "application/vnd.github+json",
    },
  });

  const githubServiceInstance = new GitHubService(axiosInstance);

  test("It has the right type", () => {
    expectTypeOf(githubServiceInstance).toMatchTypeOf<IGitHubService>();
  });

  describe("GitHubService.getRepositories", () => {
    test("it should be a success request", async () => {
      const response = await githubServiceInstance.getRepositories({ page: 1, type: "TypeScript", perPage: 1 });
      expect(response.success).toBeTruthy();
      expect(response.repositories).toBeDefined();

      if (response.repositories) expect(response.repositories.length).toBeGreaterThanOrEqual(0);
    });
  });
});

describe("Mock GitHubService", async () => {
  const axiosInstance = axios as any;
  const githubServiceInstance = new GitHubService(axiosInstance);

  test("It has the right type", () => {
    expectTypeOf(githubServiceInstance).toMatchTypeOf<IGitHubService>();
  });

  describe("Failed GitHubService.getRepositories", () => {
    axiosInstance.get.mockResolvedValueOnce({ data: GitHubGetRepositoriesMockData });
    test("it should return mock repositories", async () => {
      const response = await githubServiceInstance.getRepositories({ page: 1, type: "TypeScript", perPage: 1 });
      expect(response.success).toBeTruthy();
      expect(response.repositories).toBeDefined();

      if (response.repositories) expect(response.repositories.length).toBeGreaterThanOrEqual(0);
    });
  });
});
