'use strict'

angular.module 'bpmsclientApp'
.controller 'MainCtrl', ($scope, $http, socket) ->
  $scope.newDispute = ''
  $scope.disputes = []

  $http.get('/api/disputes').success (disputes) ->
    $scope.disputes = disputes
    socket.syncUpdates 'dispute', $scope.disputes

  $scope.deleteDispute = (dispute) ->
    $http.delete '/api/disputes/' + dispute._id

  $scope.addDispute = ->
    console.log $scope.newDispute
    return if $scope.newDispute is ''
    $http.post '/api/disputes', $scope.newDispute

  $scope.updateDispute = (dispute) ->
    $http.put '/api/disputes/' + dispute.Ref , dispute

  $scope.$on '$destroy', ->
    socket.unsyncUpdates 'dispute'
