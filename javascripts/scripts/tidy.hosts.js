#!/usr/bin/env node

const hostsFilePath = "/etc/hosts";
const fs = require("fs");
const path = require("path");
fs.readFile(hostsFilePath, (err, data) => {
    let lines = data.toString().split("\n");
    console.log("lines: " + lines.length);

    let hosts = lines.map(line => line.replace(/\s+/g, " "))
        .filter(line => !/^\s*$/.test(line))
        .filter(line => !line.startsWith("#"))
        .map(line => {
            const parts = line.split(" ");
            return {
                host: parts[0],
                domains: parts.slice(1, parts.length)
            }
        })
        .reduce((prev, next) => {
            if (prev[next.host] && Array.isArray(prev[next.host])) {
                prev[next.host] = prev[next.host].concat(next.domains);
            } else {
                prev[next.host] = next.domains;
            }
            return prev;
        }, {});

    let hostsContent = Object.keys(hosts).sort().map(key => `${key} ${hosts[key].join(" ")}`).join("\n");
    fs.writeFile(__dirname + "/hosts", hostsContent, err => {});
});
