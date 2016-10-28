import JSON

###########################################################################
#   IMPORT   #
###########################################################################
# load utility library
juliaPath = string(pwd(), "b/server/Julia/")
println(juliaPath)

a = 1;
function add()
  global a += 1
  m()
  return a
  end


  function m()
println(a)
end