#!/usr/bin/env bash
sudo -u postgres psql vyrent < '/vagrant/db.sql'
cd /vagrant
npm install
npm test