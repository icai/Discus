function InvoiceCntl($scope) {
  $scope.qty = 1;
  $scope.cost = 19.95;
}


function MyController($scope) {
  $scope.username = 'World';

  $scope.greeting = 'Hello init !'
 
  $scope.sayHello = function() {
    $scope.greeting = 'Hello ' + $scope.username + '!';
  };
}



angular.module('drag', []).
  directive('draggable', function($document) {
    return function(scope, element, attr) {
      var startX = 0, startY = 0, x = 0, y = 0;
      element.css({
       position: 'relative',
       border: '1px solid red',
       backgroundColor: 'lightgrey',
       cursor: 'pointer'
      });
      element.on('mousedown', function(event) {
        // Prevent default dragging of selected content
        event.preventDefault();
        startX = event.screenX - x;
        startY = event.screenY - y;
        $document.on('mousemove', mousemove);
        $document.on('mouseup', mouseup);
      });
 
      function mousemove(event) {
        y = event.screenY - startY;
        x = event.screenX - startX;
        element.css({
          top: y + 'px',
          left:  x + 'px'
        });
      }
 
      function mouseup() {
        $document.unbind('mousemove', mousemove);
        $document.unbind('mouseup', mouseup);
      }
    }
});



angular.module('directive', []).directive('contenteditable', function() {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      // view -> model
      elm.on('blur keyup keydown', function() {
        scope.$apply(function() {
          ctrl.$setViewValue(elm.html());
        });
      });
 
      // model -> view
      ctrl.$render = function(value) {
        elm.html(value);
      };
 
      // load init value from DOM
      ctrl.$setViewValue(elm.html());
    }
  };
}).filter('antislash', function() {
  return function(input) {
    if( input==null || input.length === 0 ){
      return null;
    }else{  
      return '\u00A0/\u00A0'; 
    }
  }
});



angular.module('timeExampleModule', []).
  // Declare new object called time,
  // which will be available for injection
  factory('time', function($timeout) {
    var time = {};
 
    (function tick() {
      time.now = new Date().toString();
      $timeout(tick, 1000);
    })();
    return time;
  });
 
// Notice that you can simply ask for time
// and it will be provided. No need to look for it.
function ClockCtrl($scope, time) {
  $scope.time = time;
}



angular.module('docsTemplateUrlDirective', [])
  .controller('Ctrl', function($scope) {
    $scope.customer = {
      name: 'Naomi',
      address: '1600 Amphitheatre'
    };
  })
  .directive('myCustomer', function() {
    return {
      templateUrl: 'my-customer.html'
    };
});


angular.module('docsScopeProblemExample', [])
  .controller('NaomiCtrl', function($scope) {
    $scope.customer = {
      name: 'Naomi',
      address: '1600 Amphitheatre'
    };
  })
  .controller('IgorCtrl', function($scope) {
    $scope.customer = {
      name: 'Igor',
      address: '123 Somewhere'
    };
  })
  .directive('myCustomer', function() {
    return {
      restrict: 'E',
      templateUrl: 'my-customer.html'
    };
});


angular.module('docsTimeDirective', [])
  .controller('Ctrl2', function($scope) {
    $scope.format = 'M/d/yy h:mm:ss a';
  })
  .directive('myCurrentTime', function($timeout, dateFilter) {
 
    function link(scope, element, attrs) {
      var format,
          timeoutId;
 
      function updateTime() {
        element.text(dateFilter(new Date(), format));
      }
 
      scope.$watch(attrs.myCurrentTime, function(value) {
        format = value;
        updateTime();
      });
 
      function scheduleUpdate() {
        // save the timeoutId for canceling
        timeoutId = $timeout(function() {
          updateTime(); // update DOM
          scheduleUpdate(); // schedule the next update
        }, 1000);
      }
 
      element.on('$destroy', function() {
        $timeout.cancel(timeoutId);
      });
 
      // start the UI update process.
      scheduleUpdate();
    }
 
    return {
      link: link
    };
  });


//  scope hierarchies

function EmployeeController($scope) {
  $scope.department = 'Engineering';
  $scope.employee = {
    name: 'Joe the Manager',
    reports: [
      {name: 'John Smith'},
      {name: 'Mary Run'}
    ]
  };
}

// controller : scope events propagation
function EventController($scope) {
  $scope.count = 0;
  $scope.$on('MyEvent', function() {
    $scope.count++;
  });
}




// templates-demo 
angular.module('ngViewExample', ['ngRoute', 'ngAnimate'],
  function($routeProvider, $locationProvider) {
    $routeProvider.when('/Book/:bookId', {
      templateUrl: '/tmpl/book.html',
      controller: BookCntl,
      controllerAs: 'book'
    });
    $routeProvider.when('/Book/:bookId/ch/:chapterId', {
      templateUrl: '/tmpl/chapter.html',
      controller: ChapterCntl,
      controllerAs: 'chapter'
    });
 
    // configure html5 to get links working on jsfiddle
    $locationProvider.html5Mode(true);
});
 
function MainCntl($route, $routeParams, $location) {
  this.$route = $route;
  this.$location = $location;
  this.$routeParams = $routeParams;
}
 
function BookCntl($routeParams) {
  this.name = "BookCntl";
  this.params = $routeParams;
}
 
function ChapterCntl($routeParams) {
  this.name = "ChapterCntl";
  this.params = $routeParams;
}

// injecting-s2c

angular.
 module('MyServiceModule', []).
 factory('notify', ['$window', function(win) {
    var msgs = [];
    return function(msg) {
      msgs.push(msg);
      if (msgs.length == 3) {
        win.alert(msgs.join("\n"));
        msgs = [];
      }
    };
  }]);
 
function myController(scope, notifyService) {
  scope.callNotify = function(msg) {
    notifyService(msg);
  };
}
 
myController.$inject = ['$scope','notify'];