
export interface GitHubRepo {
    id: number; // Unique ID of the repository
    name: string; // Name of the repository
    full_name: string; // Full name (e.g., "owner/repo")
    owner: {
      login: string; // Username of the repository owner
      id: number; // Owner's ID
      avatar_url: string; // Owner's avatar URL
      html_url: string; // Owner's GitHub profile URL
    };
    private: boolean; // Whether the repository is private
    html_url: string; // URL to the repository on GitHub
    description: string | null; // Description of the repository
    fork: boolean; // Whether the repository is a fork
    url: string; // API URL of the repository
    branches_url: string; // API URL for branches
    default_branch: string; // Default branch (e.g., "main")
    clone_url: string; // URL for cloning the repository
    ssh_url: string; // SSH URL for the repository
    topics: string[]; // Topics associated with the repository
    created_at: string; // ISO timestamp of repository creation
    updated_at: string; // ISO timestamp of last update
    pushed_at: string; // ISO timestamp of last push
    size: number; // Size of the repository in KB
    language: string | null; // Primary language of the repository
    stargazers_count: number; // Number of stars
    watchers_count: number; // Number of watchers
    forks_count: number; // Number of forks
  }
export interface GitHubBranch {
    name: string; // Branch name (e.g., "main" or "dev")
    commit: {
      sha: string; // The SHA of the latest commit on the branch
      url: string; // API URL of the commit
    };
    protected: boolean; // Whether the branch is protected
    protection?: {
      enabled: boolean; // Whether branch protection is enabled
      required_status_checks: {
        enforcement_level: string; // Enforcement level (e.g., "non_admins")
        contexts: string[]; // Status checks required for merging
      } | null;
    };
    protection_url?: string; // URL to the branch protection settings
  }
  