declare module 'astro:content' {
	interface Render {
		'.mdx': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
			components: import('astro').MDXInstance<{}>['components'];
		}>;
	}
}

declare module 'astro:content' {
	interface RenderResult {
		Content: import('astro/runtime/server/index.js').AstroComponentFactory;
		headings: import('astro').MarkdownHeading[];
		remarkPluginFrontmatter: Record<string, any>;
	}
	interface Render {
		'.md': Promise<RenderResult>;
	}

	export interface RenderedContent {
		html: string;
		metadata?: {
			imagePaths: Array<string>;
			[key: string]: unknown;
		};
	}
}

declare module 'astro:content' {
	type Flatten<T> = T extends { [K: string]: infer U } ? U : never;

	export type CollectionKey = keyof AnyEntryMap;
	export type CollectionEntry<C extends CollectionKey> = Flatten<AnyEntryMap[C]>;

	export type ContentCollectionKey = keyof ContentEntryMap;
	export type DataCollectionKey = keyof DataEntryMap;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	/** @deprecated Use `getEntry` instead. */
	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	/** @deprecated Use `getEntry` instead. */
	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E,
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E,
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown,
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		slug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(
		collection: C,
		id: E,
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[],
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[],
	): Promise<CollectionEntry<C>[]>;

	export function render<C extends keyof AnyEntryMap>(
		entry: AnyEntryMap[C][string],
	): Promise<RenderResult>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C,
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
				}
			: {
					collection: C;
					id: keyof DataEntryMap[C];
				}
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C,
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		"os": {
"alma-8/db-mssql.md": {
	id: "alma-8/db-mssql.md";
  slug: "alma-8/db-mssql";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"alma-8/db-mysql.md": {
	id: "alma-8/db-mysql.md";
  slug: "alma-8/db-mysql";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"alma-8/db-oracle.md": {
	id: "alma-8/db-oracle.md";
  slug: "alma-8/db-oracle";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"alma-8/db-postgres.md": {
	id: "alma-8/db-postgres.md";
  slug: "alma-8/db-postgres";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"alma-8/erlang-rabbitmq.md": {
	id: "alma-8/erlang-rabbitmq.md";
  slug: "alma-8/erlang-rabbitmq";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"alma-8/mo-installer.md": {
	id: "alma-8/mo-installer.md";
  slug: "alma-8/mo-installer";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"alma-8/system-prep.md": {
	id: "alma-8/system-prep.md";
  slug: "alma-8/system-prep";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"alma-8/verify.md": {
	id: "alma-8/verify.md";
  slug: "alma-8/verify";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"alma-9/db-mssql.md": {
	id: "alma-9/db-mssql.md";
  slug: "alma-9/db-mssql";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"alma-9/db-mysql.md": {
	id: "alma-9/db-mysql.md";
  slug: "alma-9/db-mysql";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"alma-9/db-oracle.md": {
	id: "alma-9/db-oracle.md";
  slug: "alma-9/db-oracle";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"alma-9/db-postgres.md": {
	id: "alma-9/db-postgres.md";
  slug: "alma-9/db-postgres";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"alma-9/erlang-rabbitmq.md": {
	id: "alma-9/erlang-rabbitmq.md";
  slug: "alma-9/erlang-rabbitmq";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"alma-9/mo-installer.md": {
	id: "alma-9/mo-installer.md";
  slug: "alma-9/mo-installer";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"alma-9/system-prep.md": {
	id: "alma-9/system-prep.md";
  slug: "alma-9/system-prep";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"alma-9/verify.md": {
	id: "alma-9/verify.md";
  slug: "alma-9/verify";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"alpine-3.18/db-mssql.md": {
	id: "alpine-3.18/db-mssql.md";
  slug: "alpine-318/db-mssql";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"alpine-3.18/db-mysql.md": {
	id: "alpine-3.18/db-mysql.md";
  slug: "alpine-318/db-mysql";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"alpine-3.18/db-oracle.md": {
	id: "alpine-3.18/db-oracle.md";
  slug: "alpine-318/db-oracle";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"alpine-3.18/db-postgres.md": {
	id: "alpine-3.18/db-postgres.md";
  slug: "alpine-318/db-postgres";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"alpine-3.18/erlang-rabbitmq.md": {
	id: "alpine-3.18/erlang-rabbitmq.md";
  slug: "alpine-318/erlang-rabbitmq";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"alpine-3.18/mo-installer.md": {
	id: "alpine-3.18/mo-installer.md";
  slug: "alpine-318/mo-installer";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"alpine-3.18/system-prep.md": {
	id: "alpine-3.18/system-prep.md";
  slug: "alpine-318/system-prep";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"alpine-3.18/verify.md": {
	id: "alpine-3.18/verify.md";
  slug: "alpine-318/verify";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"alpine-3.19/db-mssql.md": {
	id: "alpine-3.19/db-mssql.md";
  slug: "alpine-319/db-mssql";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"alpine-3.19/db-mysql.md": {
	id: "alpine-3.19/db-mysql.md";
  slug: "alpine-319/db-mysql";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"alpine-3.19/db-oracle.md": {
	id: "alpine-3.19/db-oracle.md";
  slug: "alpine-319/db-oracle";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"alpine-3.19/db-postgres.md": {
	id: "alpine-3.19/db-postgres.md";
  slug: "alpine-319/db-postgres";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"alpine-3.19/erlang-rabbitmq.md": {
	id: "alpine-3.19/erlang-rabbitmq.md";
  slug: "alpine-319/erlang-rabbitmq";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"alpine-3.19/mo-installer.md": {
	id: "alpine-3.19/mo-installer.md";
  slug: "alpine-319/mo-installer";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"alpine-3.19/system-prep.md": {
	id: "alpine-3.19/system-prep.md";
  slug: "alpine-319/system-prep";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"alpine-3.19/verify.md": {
	id: "alpine-3.19/verify.md";
  slug: "alpine-319/verify";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"alpine-3.20/db-mssql.md": {
	id: "alpine-3.20/db-mssql.md";
  slug: "alpine-320/db-mssql";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"alpine-3.20/db-mysql.md": {
	id: "alpine-3.20/db-mysql.md";
  slug: "alpine-320/db-mysql";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"alpine-3.20/db-oracle.md": {
	id: "alpine-3.20/db-oracle.md";
  slug: "alpine-320/db-oracle";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"alpine-3.20/db-postgres.md": {
	id: "alpine-3.20/db-postgres.md";
  slug: "alpine-320/db-postgres";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"alpine-3.20/erlang-rabbitmq.md": {
	id: "alpine-3.20/erlang-rabbitmq.md";
  slug: "alpine-320/erlang-rabbitmq";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"alpine-3.20/mo-installer.md": {
	id: "alpine-3.20/mo-installer.md";
  slug: "alpine-320/mo-installer";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"alpine-3.20/system-prep.md": {
	id: "alpine-3.20/system-prep.md";
  slug: "alpine-320/system-prep";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"alpine-3.20/verify.md": {
	id: "alpine-3.20/verify.md";
  slug: "alpine-320/verify";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"alpine-3.21/db-mssql.md": {
	id: "alpine-3.21/db-mssql.md";
  slug: "alpine-321/db-mssql";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"alpine-3.21/db-mysql.md": {
	id: "alpine-3.21/db-mysql.md";
  slug: "alpine-321/db-mysql";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"alpine-3.21/db-oracle.md": {
	id: "alpine-3.21/db-oracle.md";
  slug: "alpine-321/db-oracle";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"alpine-3.21/db-postgres.md": {
	id: "alpine-3.21/db-postgres.md";
  slug: "alpine-321/db-postgres";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"alpine-3.21/erlang-rabbitmq.md": {
	id: "alpine-3.21/erlang-rabbitmq.md";
  slug: "alpine-321/erlang-rabbitmq";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"alpine-3.21/mo-installer.md": {
	id: "alpine-3.21/mo-installer.md";
  slug: "alpine-321/mo-installer";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"alpine-3.21/system-prep.md": {
	id: "alpine-3.21/system-prep.md";
  slug: "alpine-321/system-prep";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"alpine-3.21/verify.md": {
	id: "alpine-3.21/verify.md";
  slug: "alpine-321/verify";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"amazon-linux-2/db-mssql.md": {
	id: "amazon-linux-2/db-mssql.md";
  slug: "amazon-linux-2/db-mssql";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"amazon-linux-2/db-mysql.md": {
	id: "amazon-linux-2/db-mysql.md";
  slug: "amazon-linux-2/db-mysql";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"amazon-linux-2/db-oracle.md": {
	id: "amazon-linux-2/db-oracle.md";
  slug: "amazon-linux-2/db-oracle";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"amazon-linux-2/db-postgres.md": {
	id: "amazon-linux-2/db-postgres.md";
  slug: "amazon-linux-2/db-postgres";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"amazon-linux-2/erlang-rabbitmq.md": {
	id: "amazon-linux-2/erlang-rabbitmq.md";
  slug: "amazon-linux-2/erlang-rabbitmq";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"amazon-linux-2/mo-installer.md": {
	id: "amazon-linux-2/mo-installer.md";
  slug: "amazon-linux-2/mo-installer";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"amazon-linux-2/system-prep.md": {
	id: "amazon-linux-2/system-prep.md";
  slug: "amazon-linux-2/system-prep";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"amazon-linux-2/verify.md": {
	id: "amazon-linux-2/verify.md";
  slug: "amazon-linux-2/verify";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"amazon-linux-2023/db-mssql.md": {
	id: "amazon-linux-2023/db-mssql.md";
  slug: "amazon-linux-2023/db-mssql";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"amazon-linux-2023/db-mysql.md": {
	id: "amazon-linux-2023/db-mysql.md";
  slug: "amazon-linux-2023/db-mysql";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"amazon-linux-2023/db-oracle.md": {
	id: "amazon-linux-2023/db-oracle.md";
  slug: "amazon-linux-2023/db-oracle";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"amazon-linux-2023/db-postgres.md": {
	id: "amazon-linux-2023/db-postgres.md";
  slug: "amazon-linux-2023/db-postgres";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"amazon-linux-2023/erlang-rabbitmq.md": {
	id: "amazon-linux-2023/erlang-rabbitmq.md";
  slug: "amazon-linux-2023/erlang-rabbitmq";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"amazon-linux-2023/mo-installer.md": {
	id: "amazon-linux-2023/mo-installer.md";
  slug: "amazon-linux-2023/mo-installer";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"amazon-linux-2023/system-prep.md": {
	id: "amazon-linux-2023/system-prep.md";
  slug: "amazon-linux-2023/system-prep";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"amazon-linux-2023/verify.md": {
	id: "amazon-linux-2023/verify.md";
  slug: "amazon-linux-2023/verify";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"centos-stream-9/db-mssql.md": {
	id: "centos-stream-9/db-mssql.md";
  slug: "centos-stream-9/db-mssql";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"centos-stream-9/db-mysql.md": {
	id: "centos-stream-9/db-mysql.md";
  slug: "centos-stream-9/db-mysql";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"centos-stream-9/db-oracle.md": {
	id: "centos-stream-9/db-oracle.md";
  slug: "centos-stream-9/db-oracle";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"centos-stream-9/db-postgres.md": {
	id: "centos-stream-9/db-postgres.md";
  slug: "centos-stream-9/db-postgres";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"centos-stream-9/erlang-rabbitmq.md": {
	id: "centos-stream-9/erlang-rabbitmq.md";
  slug: "centos-stream-9/erlang-rabbitmq";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"centos-stream-9/mo-installer.md": {
	id: "centos-stream-9/mo-installer.md";
  slug: "centos-stream-9/mo-installer";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"centos-stream-9/system-prep.md": {
	id: "centos-stream-9/system-prep.md";
  slug: "centos-stream-9/system-prep";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"centos-stream-9/verify.md": {
	id: "centos-stream-9/verify.md";
  slug: "centos-stream-9/verify";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"debian-11/db-mssql.md": {
	id: "debian-11/db-mssql.md";
  slug: "debian-11/db-mssql";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"debian-11/db-mysql.md": {
	id: "debian-11/db-mysql.md";
  slug: "debian-11/db-mysql";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"debian-11/db-oracle.md": {
	id: "debian-11/db-oracle.md";
  slug: "debian-11/db-oracle";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"debian-11/db-postgres.md": {
	id: "debian-11/db-postgres.md";
  slug: "debian-11/db-postgres";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"debian-11/erlang-rabbitmq.md": {
	id: "debian-11/erlang-rabbitmq.md";
  slug: "debian-11/erlang-rabbitmq";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"debian-11/mo-installer.md": {
	id: "debian-11/mo-installer.md";
  slug: "debian-11/mo-installer";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"debian-11/system-prep.md": {
	id: "debian-11/system-prep.md";
  slug: "debian-11/system-prep";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"debian-11/verify.md": {
	id: "debian-11/verify.md";
  slug: "debian-11/verify";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"debian-12/db-mssql.md": {
	id: "debian-12/db-mssql.md";
  slug: "debian-12/db-mssql";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"debian-12/db-mysql.md": {
	id: "debian-12/db-mysql.md";
  slug: "debian-12/db-mysql";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"debian-12/db-oracle.md": {
	id: "debian-12/db-oracle.md";
  slug: "debian-12/db-oracle";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"debian-12/db-postgres.md": {
	id: "debian-12/db-postgres.md";
  slug: "debian-12/db-postgres";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"debian-12/erlang-rabbitmq.md": {
	id: "debian-12/erlang-rabbitmq.md";
  slug: "debian-12/erlang-rabbitmq";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"debian-12/mo-installer.md": {
	id: "debian-12/mo-installer.md";
  slug: "debian-12/mo-installer";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"debian-12/system-prep.md": {
	id: "debian-12/system-prep.md";
  slug: "debian-12/system-prep";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"debian-12/verify.md": {
	id: "debian-12/verify.md";
  slug: "debian-12/verify";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"oracle-linux-8/db-mssql.md": {
	id: "oracle-linux-8/db-mssql.md";
  slug: "oracle-linux-8/db-mssql";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"oracle-linux-8/db-mysql.md": {
	id: "oracle-linux-8/db-mysql.md";
  slug: "oracle-linux-8/db-mysql";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"oracle-linux-8/db-oracle.md": {
	id: "oracle-linux-8/db-oracle.md";
  slug: "oracle-linux-8/db-oracle";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"oracle-linux-8/db-postgres.md": {
	id: "oracle-linux-8/db-postgres.md";
  slug: "oracle-linux-8/db-postgres";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"oracle-linux-8/erlang-rabbitmq.md": {
	id: "oracle-linux-8/erlang-rabbitmq.md";
  slug: "oracle-linux-8/erlang-rabbitmq";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"oracle-linux-8/mo-installer.md": {
	id: "oracle-linux-8/mo-installer.md";
  slug: "oracle-linux-8/mo-installer";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"oracle-linux-8/system-prep.md": {
	id: "oracle-linux-8/system-prep.md";
  slug: "oracle-linux-8/system-prep";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"oracle-linux-8/verify.md": {
	id: "oracle-linux-8/verify.md";
  slug: "oracle-linux-8/verify";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"oracle-linux-9/db-mssql.md": {
	id: "oracle-linux-9/db-mssql.md";
  slug: "oracle-linux-9/db-mssql";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"oracle-linux-9/db-mysql.md": {
	id: "oracle-linux-9/db-mysql.md";
  slug: "oracle-linux-9/db-mysql";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"oracle-linux-9/db-oracle.md": {
	id: "oracle-linux-9/db-oracle.md";
  slug: "oracle-linux-9/db-oracle";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"oracle-linux-9/db-postgres.md": {
	id: "oracle-linux-9/db-postgres.md";
  slug: "oracle-linux-9/db-postgres";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"oracle-linux-9/erlang-rabbitmq.md": {
	id: "oracle-linux-9/erlang-rabbitmq.md";
  slug: "oracle-linux-9/erlang-rabbitmq";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"oracle-linux-9/mo-installer.md": {
	id: "oracle-linux-9/mo-installer.md";
  slug: "oracle-linux-9/mo-installer";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"oracle-linux-9/system-prep.md": {
	id: "oracle-linux-9/system-prep.md";
  slug: "oracle-linux-9/system-prep";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"oracle-linux-9/verify.md": {
	id: "oracle-linux-9/verify.md";
  slug: "oracle-linux-9/verify";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"rhel-8/db-mssql.md": {
	id: "rhel-8/db-mssql.md";
  slug: "rhel-8/db-mssql";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"rhel-8/db-mysql.md": {
	id: "rhel-8/db-mysql.md";
  slug: "rhel-8/db-mysql";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"rhel-8/db-oracle.md": {
	id: "rhel-8/db-oracle.md";
  slug: "rhel-8/db-oracle";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"rhel-8/db-postgres.md": {
	id: "rhel-8/db-postgres.md";
  slug: "rhel-8/db-postgres";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"rhel-8/erlang-rabbitmq.md": {
	id: "rhel-8/erlang-rabbitmq.md";
  slug: "rhel-8/erlang-rabbitmq";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"rhel-8/mo-installer.md": {
	id: "rhel-8/mo-installer.md";
  slug: "rhel-8/mo-installer";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"rhel-8/system-prep.md": {
	id: "rhel-8/system-prep.md";
  slug: "rhel-8/system-prep";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"rhel-8/verify.md": {
	id: "rhel-8/verify.md";
  slug: "rhel-8/verify";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"rhel-9/db-mssql.md": {
	id: "rhel-9/db-mssql.md";
  slug: "rhel-9/db-mssql";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"rhel-9/db-mysql.md": {
	id: "rhel-9/db-mysql.md";
  slug: "rhel-9/db-mysql";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"rhel-9/db-oracle.md": {
	id: "rhel-9/db-oracle.md";
  slug: "rhel-9/db-oracle";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"rhel-9/db-postgres.md": {
	id: "rhel-9/db-postgres.md";
  slug: "rhel-9/db-postgres";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"rhel-9/erlang-rabbitmq.md": {
	id: "rhel-9/erlang-rabbitmq.md";
  slug: "rhel-9/erlang-rabbitmq";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"rhel-9/mo-installer.md": {
	id: "rhel-9/mo-installer.md";
  slug: "rhel-9/mo-installer";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"rhel-9/system-prep.md": {
	id: "rhel-9/system-prep.md";
  slug: "rhel-9/system-prep";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"rhel-9/verify.md": {
	id: "rhel-9/verify.md";
  slug: "rhel-9/verify";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"rocky-8/db-mssql.md": {
	id: "rocky-8/db-mssql.md";
  slug: "rocky-8/db-mssql";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"rocky-8/db-mysql.md": {
	id: "rocky-8/db-mysql.md";
  slug: "rocky-8/db-mysql";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"rocky-8/db-oracle.md": {
	id: "rocky-8/db-oracle.md";
  slug: "rocky-8/db-oracle";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"rocky-8/db-postgres.md": {
	id: "rocky-8/db-postgres.md";
  slug: "rocky-8/db-postgres";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"rocky-8/erlang-rabbitmq.md": {
	id: "rocky-8/erlang-rabbitmq.md";
  slug: "rocky-8/erlang-rabbitmq";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"rocky-8/mo-installer.md": {
	id: "rocky-8/mo-installer.md";
  slug: "rocky-8/mo-installer";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"rocky-8/system-prep.md": {
	id: "rocky-8/system-prep.md";
  slug: "rocky-8/system-prep";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"rocky-8/verify.md": {
	id: "rocky-8/verify.md";
  slug: "rocky-8/verify";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"rocky-9/db-mssql.md": {
	id: "rocky-9/db-mssql.md";
  slug: "rocky-9/db-mssql";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"rocky-9/db-mysql.md": {
	id: "rocky-9/db-mysql.md";
  slug: "rocky-9/db-mysql";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"rocky-9/db-oracle.md": {
	id: "rocky-9/db-oracle.md";
  slug: "rocky-9/db-oracle";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"rocky-9/db-postgres.md": {
	id: "rocky-9/db-postgres.md";
  slug: "rocky-9/db-postgres";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"rocky-9/erlang-rabbitmq.md": {
	id: "rocky-9/erlang-rabbitmq.md";
  slug: "rocky-9/erlang-rabbitmq";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"rocky-9/mo-installer.md": {
	id: "rocky-9/mo-installer.md";
  slug: "rocky-9/mo-installer";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"rocky-9/system-prep.md": {
	id: "rocky-9/system-prep.md";
  slug: "rocky-9/system-prep";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"rocky-9/verify.md": {
	id: "rocky-9/verify.md";
  slug: "rocky-9/verify";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"sles-15/db-mssql.md": {
	id: "sles-15/db-mssql.md";
  slug: "sles-15/db-mssql";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"sles-15/db-mysql.md": {
	id: "sles-15/db-mysql.md";
  slug: "sles-15/db-mysql";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"sles-15/db-oracle.md": {
	id: "sles-15/db-oracle.md";
  slug: "sles-15/db-oracle";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"sles-15/db-postgres.md": {
	id: "sles-15/db-postgres.md";
  slug: "sles-15/db-postgres";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"sles-15/erlang-rabbitmq.md": {
	id: "sles-15/erlang-rabbitmq.md";
  slug: "sles-15/erlang-rabbitmq";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"sles-15/mo-installer.md": {
	id: "sles-15/mo-installer.md";
  slug: "sles-15/mo-installer";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"sles-15/system-prep.md": {
	id: "sles-15/system-prep.md";
  slug: "sles-15/system-prep";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"sles-15/verify.md": {
	id: "sles-15/verify.md";
  slug: "sles-15/verify";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"ubuntu-20.04/db-mssql.md": {
	id: "ubuntu-20.04/db-mssql.md";
  slug: "ubuntu-2004/db-mssql";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"ubuntu-20.04/db-mysql.md": {
	id: "ubuntu-20.04/db-mysql.md";
  slug: "ubuntu-2004/db-mysql";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"ubuntu-20.04/db-oracle.md": {
	id: "ubuntu-20.04/db-oracle.md";
  slug: "ubuntu-2004/db-oracle";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"ubuntu-20.04/db-postgres.md": {
	id: "ubuntu-20.04/db-postgres.md";
  slug: "ubuntu-2004/db-postgres";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"ubuntu-20.04/erlang-rabbitmq.md": {
	id: "ubuntu-20.04/erlang-rabbitmq.md";
  slug: "ubuntu-2004/erlang-rabbitmq";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"ubuntu-20.04/mo-installer.md": {
	id: "ubuntu-20.04/mo-installer.md";
  slug: "ubuntu-2004/mo-installer";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"ubuntu-20.04/system-prep.md": {
	id: "ubuntu-20.04/system-prep.md";
  slug: "ubuntu-2004/system-prep";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"ubuntu-20.04/verify.md": {
	id: "ubuntu-20.04/verify.md";
  slug: "ubuntu-2004/verify";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"ubuntu-22.04/db-mssql.md": {
	id: "ubuntu-22.04/db-mssql.md";
  slug: "ubuntu-2204/db-mssql";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"ubuntu-22.04/db-mysql.md": {
	id: "ubuntu-22.04/db-mysql.md";
  slug: "ubuntu-2204/db-mysql";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"ubuntu-22.04/db-oracle.md": {
	id: "ubuntu-22.04/db-oracle.md";
  slug: "ubuntu-2204/db-oracle";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"ubuntu-22.04/db-postgres.md": {
	id: "ubuntu-22.04/db-postgres.md";
  slug: "ubuntu-2204/db-postgres";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"ubuntu-22.04/erlang-rabbitmq.md": {
	id: "ubuntu-22.04/erlang-rabbitmq.md";
  slug: "ubuntu-2204/erlang-rabbitmq";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"ubuntu-22.04/mo-installer.md": {
	id: "ubuntu-22.04/mo-installer.md";
  slug: "ubuntu-2204/mo-installer";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"ubuntu-22.04/system-prep.md": {
	id: "ubuntu-22.04/system-prep.md";
  slug: "ubuntu-2204/system-prep";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"ubuntu-22.04/verify.md": {
	id: "ubuntu-22.04/verify.md";
  slug: "ubuntu-2204/verify";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"ubuntu-24.04/db-mssql.md": {
	id: "ubuntu-24.04/db-mssql.md";
  slug: "ubuntu-2404/db-mssql";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"ubuntu-24.04/db-mysql.md": {
	id: "ubuntu-24.04/db-mysql.md";
  slug: "ubuntu-2404/db-mysql";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"ubuntu-24.04/db-oracle.md": {
	id: "ubuntu-24.04/db-oracle.md";
  slug: "ubuntu-2404/db-oracle";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"ubuntu-24.04/db-postgres.md": {
	id: "ubuntu-24.04/db-postgres.md";
  slug: "ubuntu-2404/db-postgres";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"ubuntu-24.04/erlang-rabbitmq.md": {
	id: "ubuntu-24.04/erlang-rabbitmq.md";
  slug: "ubuntu-2404/erlang-rabbitmq";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"ubuntu-24.04/mo-installer.md": {
	id: "ubuntu-24.04/mo-installer.md";
  slug: "ubuntu-2404/mo-installer";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"ubuntu-24.04/system-prep.md": {
	id: "ubuntu-24.04/system-prep.md";
  slug: "ubuntu-2404/system-prep";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
"ubuntu-24.04/verify.md": {
	id: "ubuntu-24.04/verify.md";
  slug: "ubuntu-2404/verify";
  body: string;
  collection: "os";
  data: any
} & { render(): Render[".md"] };
};

	};

	type DataEntryMap = {
		
	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	export type ContentConfig = never;
}
