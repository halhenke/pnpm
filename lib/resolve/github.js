var basename = require('path').basename
var crypto = require('crypto')
var git = require('git-promise');

// install formats
// install.usage = '\nnpm install (with no args, in package dir)' +
//                 '\nnpm install [<@scope>/]<pkg>' +
//                 '\nnpm install [<@scope>/]<pkg>@<tag>' +
//                 '\nnpm install [<@scope>/]<pkg>@<version>' +
//                 '\nnpm install [<@scope>/]<pkg>@<version range>' +
//                 '\nnpm install <folder>' +
//                 '\nnpm install <tarball file>' +
//                 '\nnpm install <tarball url>' +
//                 '\nnpm install <git:// url>' +
//                 '\nnpm install <github username>/<github project>' +
//                 '\n\nalias: npm i' +
//                 '\ncommon options: [--save|--save-dev|--save-optional] [--save-exact]'

// GIT
 <protocol>://[<user>[:<password>]@]<hostname>[:<port>][:][/]<path>[#<commit-ish>]
// GITHUB
<githubname>/<githubrepo>[#<commit-ish>]
github:<githubname>/<githubrepo>[#<commit-ish>]:
// GIST
[<githubname>/]<gistID>[#<commit-ish>]:
// BITBUCKET
bitbucket:<bitbucketname>/<bitbucketrepo>[#<commit-ish>]:
// GITLAB
gitlab:<gitlabname>/<gitlabrepo>[#<commit-ish>]

/**
 * Resolves a 'github' package.
 *
 *     pkg = {
 *       raw: 'http://registry.npmjs.org/is-array/-/is-array-1.0.1.tgz',
 *       scope: null,
 *       name: null,
 *       rawSpec: 'http://registry.npmjs.org/is-array/-/is-array-1.0.1.tgz',
 *       spec: 'http://registry.npmjs.org/is-array/-/is-array-1.0.1.tgz',
 *       type: 'remote' }
 *     resolveTarball(pkg)
 */

module.exports = function resolveGithub (pkg) {
  var name = basename(pkg.raw).replace(/(\.tgz|\.tar\.gz)$/i, '')

  return git(`clone --mirror ${remote} ${local}`)
  // return Promise.resolve({
  //   name: name,
  //   fullname: name + '#' + hash(pkg.raw),
  //   dist: {
  //     tarball: pkg.raw
  //   }
  // })
}

function hash (str) {
  var hash = crypto.createHash('sha1')
  hash.update(str)
  return hash.digest('hex')
}
