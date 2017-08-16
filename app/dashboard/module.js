'use strict';

angular.module('app.dashboard', [
    'ui.router',
    'ngResource',
    'ngMaterial'
])

.config(function ($stateProvider) {
    $stateProvider
        .state('app.dashboard', {
            authentication: true,
            url: '/dashboard',
            views: {
                "content@app": {
                    controller: 'botConsCtrl',
                    templateUrl: 'app/dashboard/dashboard-bot.html'
                }
            },
            data:{
                title: 'Dashboard'
            }
        })
        .state('app.bot-setting',{
            url: '/bot-setting',
            views: {
                "content@app":{
                    controller: 'botSettingCtrl',
                    templateUrl: 'app/dashboard/bot-setting/bot-setting.html'
                }
            }
        })
        .state('app.dashboard-analytic', {
            url: '/dashboard-analytic',
            views: {
                "content@app": {
                    controller: 'DashboardCtrlAnalytic',
                    templateUrl: 'app/dashboard/dashboard-analytic.html'
                }
            },
            data:{
                title: 'Dashboard'
            }
        })
      
        .state('app.dashboard-social', {
            url: '/dashboard-social',
            views: {
                "content@app": {
                    templateUrl: 'app/dashboard/social-wall.html'
                }
            },
            data:{
                title: 'Dashboard Social'
            }
        });
        // .state('app.dashboard-bot', {
        //     url: '/dashboard-bot',
        //     views: {
        //         "content@app": {
        //             controller: 'botConsCtrl',
        //             templateUrl: 'app/dashboard/dashboard-bot.html'
        //         }
        //     },
        //     data:{
        //         title: 'Dashboard Bot'
        //     }
        // });
});
