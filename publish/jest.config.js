module.exports = {
    moduleFileExtensions:[
        'ts',
        'tsx',
        'js',
        'json'
    ],
    transform:{
        '^.+\\.(js|ts|tsx)$': 'ts-jest',
    },
    testRegex: "^.+\/test\/.*\\.spec\\.(js|ts)$"
}