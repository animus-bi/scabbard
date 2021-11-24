import * as path from 'path';

const baseConfig = {
  tmpPath: path.join(__dirname, '../tmp'),
  pantryPath: path.join(__dirname, 'pantry'),

  pantrySubPath: (subpath) => path.join(baseConfig.pantryPath, subpath)

}

export const config = baseConfig;