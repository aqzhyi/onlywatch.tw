import { deleteSync } from 'del'

deleteSync(['.turbo', 'dist', 'out', '.next/**', 'node_modules'])
