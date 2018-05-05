myApp.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider, $rootScope) {
    $routeProvider
        .when('/', {
            templateUrl: '/views/indexView.html'
        })
        .when('/signin', {
            templateUrl: '/views/signIn.html',
            controller: 'userController',
            controllerAs: 'user'
        })
        .when('/admindashboard', {
            templateUrl: '/views/adminDashboard.html',
            resolve: {
                "check": function ($location, $rootScope, $localStorage,UserService) {
                    routeGuard($location, $rootScope, $localStorage,UserService);
                }
            },
            controller: 'testController',
            controllerAs: 'test'
        })
        .when('/addtest', {
            templateUrl: '/views/addTest.html',
            resolve: {
                "check": function ($location, $rootScope, $localStorage,UserService) {
                    routeGuard($location, $rootScope, $localStorage,UserService);
                }
            },
            controller: 'testController',
            controllerAs: 'test'
        })
        .when('/testDetails', {
            templateUrl: '/views/testDetails.html',
            resolve: {
                "check": function ($location, $rootScope, $localStorage,UserService) {
                    routeGuard($location, $rootScope, $localStorage,UserService);
                }
            },
            controller: 'testController',
            controllerAs: 'test'
        })
        .when('/userdashboard', {
            templateUrl: '/views/userDashboard.html',
            resolve: {
                "check": function ($location, $rootScope,$localStorage, UserService) {
                    routeGuard($location, $rootScope, $localStorage,UserService);
                }
            },
            controller: 'testController',
            controllerAs: 'test'
        })
        .when('/testrun', {
            templateUrl: '/views/testRun.html',
            resolve: {
                "check": function ($location, $rootScope, $localStorage,UserService) {
                    routeGuard($location, $rootScope, $localStorage,UserService);
                }
            },
            controller: 'testRunController',
            controllerAs: 'testRun'
        })
        .when('/testStats', {
            templateUrl: '/views/testStatistics.html',
            resolve: {
                "check": function ($location, $rootScope, $localStorage,UserService) {
                    routeGuard($location, $rootScope, $localStorage,UserService);
                }
            },
            controller: 'testStatistics',
            controllerAs: 'testStat'
        })
        .when('/userStats', {
            templateUrl: '/views/userStatistics.html',
            resolve: {
                "check": function ($location, $rootScope, $localStorage,UserService) {
                    routeGuard($location, $rootScope, $localStorage,UserService);
                }
            },
            controller: 'testStatistics',
            controllerAs: 'testStat'
        })
        .when('/available-tests', {
            templateUrl: '/views/availableTests.html',
            resolve: {
                "check": function ($location, $rootScope, $localStorage,UserService) {
                    routeGuard($location, $rootScope, $localStorage,UserService);
                }
            },
            controller: 'testController',
            controllerAs: 'test'
        })
        .when('/attempted-tests', {
            templateUrl: '/views/attemptedTests.html',
            resolve: {
                "check": function ($location, $rootScope, $localStorage,UserService) {
                    routeGuard($location, $rootScope, $localStorage,UserService);
                }
            },
            controller: 'testController',
            controllerAs: 'test'
        })
        .when('/allUsers', {
            templateUrl: '/views/allUsers.html',
            resolve: {
                "check": function ($location, $rootScope, $localStorage,UserService) {
                    routeGuard($location, $rootScope, $localStorage,UserService);
                }
            },
            controller: 'testStatistics',
            controllerAs: 'testStat'
        })
        .otherwise({
            redirectTo: '/'
        });

    $locationProvider.html5Mode({
        enabled: false,
        requireBase: false
    });

    function routeGuard($location, $rootScope, $localStorage,UserService) {
        if($localStorage.user===UserService.user){
            if (!UserService.isAuthenticated()) {
                alert("Token Expired :(");
                $location.path('/');
                $rootScope.isLoggedIn=false;
            } else {
                $rootScope.isLoggedIn = true;
            }

        } else {
            $location.path('/');
            $rootScope.isLoggedIn = false;
        }
    };

}]);