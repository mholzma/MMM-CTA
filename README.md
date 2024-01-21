> [!CAUTION]
> This module is still in development and is not ready for use.

# MMM-CTA

This is a module for the [MagicMirror²](https://github.com/MichMich/MagicMirror/).

<!-- TODO: Add API Key instructions -->

## Installation

In ~/MagicMirror/modules
```sh
git clone https://github.com/JHWelch/MMM-CTA.git
```

Install NPM dependencies
```sh
cd MMM-CTA
npm install --production
```

## Using the module

To use this module, add the following configuration block to the modules array in the `config/config.js` file:
```js
var config = {
    modules: [
        {
            module: 'MMM-CTA',
            config: {
                // See below for configurable options
            }
        }
    ]
}
```

## Configuration options
<!-- TODO: Add config options -->

| Option           | Required?    | Description                                                            |
| ---------------- | ------------ | ---------------------------------------------------------------------- |
| `busToken`       | **Required** | How to get?                                                            |
| `trainToken`     | **Required** | How to get?                                                            |
| `updateInterval` | *Optional*   | Refresh time in milliseconds <br>Default 60000 milliseconds (1 minute) |

## Development

### Installation

```sh
npm install
```

### Testing

There is a test suite using Jest.

```sh
npm test
```

### Linting

```sh
# Run linting
npm run lint

# Fix linting errors
npm run fix
```
