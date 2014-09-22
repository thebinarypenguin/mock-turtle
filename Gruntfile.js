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
    }
  });

  grunt.loadNpmTasks('grunt-mocha-cli');
  grunt.loadNpmTasks('grunt-bump');

  grunt.registerTask('default', ['mochacli']);
  grunt.registerTask('test',    ['mochacli']);

  grunt.registerTask("release", "Release a new version and push it to GitHub", function(target) {
    if (!target) {
      target = "patch";
    }
    return grunt.task.run("bump-only:" + target, "bump-commit");
  });
};