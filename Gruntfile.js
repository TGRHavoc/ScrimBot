module.exports = function(grunt){
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
	  	uglify: {
	    	options: {
	      		banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
						        '<%= grunt.template.today("yyyy-mm-dd") %>\\n' +
						        '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
						        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
						        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
	    	},
			minify: {
				files: grunt.file.expandMapping(['lib/**/*.js', 'lib/app.js'], 'destination/', {rename: function(destBase, destPath) { return destBase+destPath.replace('.js', '.min.js').replace("lib/", ""); }
				})
			}
	  	}
	});

	// Load the plugin that provides the "uglify" task.
	grunt.loadNpmTasks('grunt-contrib-uglify');

	// Default task(s).
	grunt.registerTask('default', ['uglify']);
};
