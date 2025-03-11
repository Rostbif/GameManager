#!/bin/bash

# Start MongoDB with replica set configuration
mongod --replSet rs0 --bind_ip_all &

# Wait for MongoDB to start
sleep 10

# Initialize the replica set
mongo --eval 'rs.initiate({_id: "rs0", members: [{_id: 0, host: "localhost:27017"}]})'

# Keep the container running
tail -f /dev/null