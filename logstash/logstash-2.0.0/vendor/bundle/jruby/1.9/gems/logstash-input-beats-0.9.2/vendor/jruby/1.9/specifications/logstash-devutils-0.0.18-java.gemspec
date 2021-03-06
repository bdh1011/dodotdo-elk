# -*- encoding: utf-8 -*-
# stub: logstash-devutils 0.0.18 java lib lib

Gem::Specification.new do |s|
  s.name = "logstash-devutils"
  s.version = "0.0.18"
  s.platform = "java"

  s.required_rubygems_version = Gem::Requirement.new(">= 0") if s.respond_to? :required_rubygems_version=
  s.require_paths = ["lib", "lib"]
  s.authors = ["Jordan Sissel"]
  s.date = "2015-10-08"
  s.description = "logstash-devutils"
  s.email = ["jls@semicomplete.com"]
  s.homepage = "https://github.com/elasticsearch/logstash-devutils"
  s.licenses = ["Apache 2.0"]
  s.rubygems_version = "2.4.8"
  s.summary = "logstash-devutils"

  s.installed_by_version = "2.4.8" if s.respond_to? :installed_by_version

  if s.respond_to? :specification_version then
    s.specification_version = 4

    if Gem::Version.new(Gem::VERSION) >= Gem::Version.new('1.2.0') then
      s.add_runtime_dependency(%q<rspec>, ["~> 3.1.0"])
      s.add_runtime_dependency(%q<rspec-wait>, [">= 0"])
      s.add_runtime_dependency(%q<rake>, [">= 0"])
      s.add_runtime_dependency(%q<gem_publisher>, [">= 0"])
      s.add_runtime_dependency(%q<minitar>, [">= 0"])
      s.add_runtime_dependency(%q<insist>, ["= 1.0.0"])
      s.add_runtime_dependency(%q<kramdown>, [">= 0"])
      s.add_runtime_dependency(%q<stud>, [">= 0.0.20"])
    else
      s.add_dependency(%q<rspec>, ["~> 3.1.0"])
      s.add_dependency(%q<rspec-wait>, [">= 0"])
      s.add_dependency(%q<rake>, [">= 0"])
      s.add_dependency(%q<gem_publisher>, [">= 0"])
      s.add_dependency(%q<minitar>, [">= 0"])
      s.add_dependency(%q<insist>, ["= 1.0.0"])
      s.add_dependency(%q<kramdown>, [">= 0"])
      s.add_dependency(%q<stud>, [">= 0.0.20"])
    end
  else
    s.add_dependency(%q<rspec>, ["~> 3.1.0"])
    s.add_dependency(%q<rspec-wait>, [">= 0"])
    s.add_dependency(%q<rake>, [">= 0"])
    s.add_dependency(%q<gem_publisher>, [">= 0"])
    s.add_dependency(%q<minitar>, [">= 0"])
    s.add_dependency(%q<insist>, ["= 1.0.0"])
    s.add_dependency(%q<kramdown>, [">= 0"])
    s.add_dependency(%q<stud>, [">= 0.0.20"])
  end
end
