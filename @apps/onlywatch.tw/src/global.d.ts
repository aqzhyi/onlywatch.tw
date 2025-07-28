interface EnvVarables {
  readonly SUPABASE_PROJECT_ID: string
}

declare namespace NodeJS {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface ProcessEnv extends EnvVarables {}
}

interface ImportMeta {
  readonly env: EnvVarables
}
