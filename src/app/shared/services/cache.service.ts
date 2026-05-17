// src/app/shared/services/cache.service.ts
import { Injectable }     from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap }            from 'rxjs/operators';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresIn: number; // ms
}

@Injectable({ providedIn: 'root' })
export class CacheService {
  private cache = new Map<string, CacheEntry<any>>();

  private readonly DEFAULT_TTL = 30 * 60 * 1000;

  set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiresIn: ttl
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > entry.expiresIn;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  invalidate(key: string): void {
    this.cache.delete(key);
  }

  invalidatePattern(pattern: string): void {
    this.cache.forEach((_, key) => {
      if (key.includes(pattern)) this.cache.delete(key);
    });
  }

  clear(): void {
    this.cache.clear();
  }

  // Helper para wrappear un Observable con caché
  wrap<T>(key: string, source$: Observable<T>, ttl?: number): Observable<T> {
    const cached = this.get<T>(key);
    if (cached !== null) {
      return of(cached); // Devuelve inmediatamente sin HTTP
    }
    return source$.pipe(
      tap(data => this.set(key, data, ttl))
    );
  }
}
