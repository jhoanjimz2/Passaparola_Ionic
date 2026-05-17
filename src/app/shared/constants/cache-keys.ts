// src/app/shared/constants/cache-keys.ts
export const CACHE_KEYS = {
  // Perfil completo del seat/usuario
  profile: (id: string) => `profile:${id}`,

  // Feed principal de posts
  feed: (id: string) => `feed:${id}`,

  // Feed de likes, guardados, compartidos
  feedLike: (id: string) => `feed:like:${id}`,
  feedSaved: (id: string) => `feed:saved:${id}`,
  feedShared: (id: string) => `feed:shared:${id}`,

  // Seguidores
  followers: (id: string) => `followers:${id}`,

  // Menús/boards
  boards: (id: string) => `boards:${id}`,
};
