## :question: What is this Project about?

This project is a TypeScript based common Test Automation core framework which enables Test Automation developers to write Automated tests for Web, API and Mobile Native Apps (Android and iOS) platforms.

## :briefcase: What does this project contain?

- This project contains different modules for core Test Automation framework.
- config module contains various test related confugurations for API and Mobile native app tests.
- logging module contains winston logging related configurations and custom logging methods for logging messages for different log levels
- results module is for storing test results and screenshots
- utils module contains classes for each platform having common utility methods for the respective platforms

## Running the tests

- [NodeJS](https://nodejs.org/en/download/) should be installed on the local machine where tests needs to be run.
- The commands for running tests are configured in package.json file under scripts section
- Build the project using `npm run build` command
- To run the tests for specific platform, we can run the script defined for that particular platform. For example to run android natiave app tests - `npm run android_test`
- To generate allure test report, we can run the generate report script for the respective platform. For example to generate webui test report - `npm run generate_webui_report`
- To open the generated allure report - `npm run open_report`
