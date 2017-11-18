#version 330

uniform vec3 uLightDir;

uniform vec3 uAmbientLight;
uniform vec3 uDiffuseLight;
uniform vec3 uSpecularLight;

uniform vec3 uAmbientMaterial;
uniform vec3 uDiffuseMaterial;
uniform vec3 uSpecularMaterial;

uniform float uSpecularPower;

uniform sampler2D uTexture;
uniform sampler2D uNormalMap;

in vec3 vViewPath;
in vec2 vTexCoord;
in mat3 vTBN;

in vec3 Normal;
in vec3 Tangente;

out vec4 outColor;

void main() {
    vec3 L = normalize(uLightDir);
    
    vec3 normal = texture(uNormalMap, vTexCoord).rgb;
	normal = normalize(normal * 2.0 - 1.0);
	
	vec3 T = normalize(Tangente - dot(Tangente, Normal) * Normal);
	vec3 B = cross(T, Normal);
	mat3 TBN = mat3(T, B, Normal);
	
	vec3 N = normalize(TBN * normal); 

    vec3 ambient = uAmbientLight * uAmbientMaterial;
    
    float diffuseIntensity = max(dot(N, -L), 0.0);
    vec3 diffuse = diffuseIntensity * uDiffuseLight * uDiffuseMaterial;
       
    //Calculo do componente especular
	float specularIntensity = 0.0;
	if (uSpecularPower > 0.0) {
		vec3 V = normalize(vViewPath);
		vec3 R = reflect(L, N);
		specularIntensity = pow(max(dot(R, V), 0.0), uSpecularPower);
	}
    vec3 specular = specularIntensity * uSpecularLight * uSpecularMaterial;
    vec4 texel = texture(uTexture, vTexCoord);
    
    vec3 color = clamp(texel.rgb * (ambient + diffuse) + specular, 0.0, texel.a);
    outColor = vec4(color, 1.0);
}