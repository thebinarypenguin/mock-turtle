module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // Test
    mochacli: {
      options: {
        reporter: 'spec'
      },
      all: ['test/*.js']
    },

    // Bump, Tag, Push
    bump: {
      options: {
        updateConfigs: ['pkg'],
        commitFiles: ['-a'],
        pushTo: 'origin'
      }
    },

    // Publish
    shell: {
      publish: {
        command : "npm publish"
      }
    }
  });

  grunt.loadNpmTasks('grunt-mocha-cli');
  grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks('grunt-shell');

  grunt.registerTask('default', ['mochacli']);
  grunt.registerTask('test',    ['mochacli']);

  grunt.registerTask("release", "Release a new version, push it and publish it", function(target) {
    if (!target) {
      target = "patch";
    }
    return grunt.task.run("bump-only:" + target, "bump-commit", "shell:publish");
  });
};