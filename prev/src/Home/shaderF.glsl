varying vec2 v_uv;
varying vec3 v_position;

uniform float u_time;
uniform vec3 u_color;
uniform vec2 u_mouse;
uniform vec2 u_resolution;

mat2 getRotationMatrix(float theta){return mat2(cos(theta), -sin(theta), sin(theta), cos(theta));}
mat2 getScaleMatrix(float scale){return mat2(scale,0, 0,scale);}
float ellipse(vec2 pt, vec2 center, vec2 radius){return 1.0 - step(0.5, length(pt - center));}
float ellipse(vec2 pt, vec2 center, vec2 radius, bool soften){return 1.0 - smoothstep(radius.x-radius.x*0.5, radius.y+radius.y*0.5, length(pt-center));}
float ellipse(vec2 pt, vec2 center, vec2 radius, float linewidth){return step(radius.x-linewidth/2.0, length(pt - center)) - step(radius.y+linewidth/2.0, length(pt - center));}
float rect(vec2 pt, vec2 center, vec2 size, vec2 anchor){return step(-size.x-anchor.x,pt.x-center.x)-step(size.x-anchor.x,pt.x-center.x)*step(-size.y-anchor.x,pt.y-center.y)-step(size.y-anchor.y,pt.y-center.y);}
float line(vec2 pt, float linewidth, float edge_thickness){return smoothstep(pt.x-linewidth/2.0-edge_thickness, pt.x+linewidth/2.0, pt.y)-smoothstep(pt.x+linewidth/2.0-edge_thickness, pt.x+linewidth/2.0, pt.y);}
float random(vec2 pt, float seed){return fract(sin(dot(pt, vec2(12.9,78.2))+seed)*43758.5);}
float noise(vec2 st, float seed){
    vec2 i = floor(st);
    vec2 f = fract(st);
    vec2 u = f*f*(3.0-2.0*f);
    float a = random(i+vec2(0.0,0.0),seed);
    float b = random(i+vec2(1.0,0.0),seed);
    float c = random(i+vec2(0.0,1.0),seed);
    float d = random(i+vec2(1.0,1.0),seed);
    return mix(a,b,u.x)+(c-a)*u.y*(1.0-u.x)+(d-b)*u.x*u.y;
}
void main(){
    vec2 mouse = u_mouse-u_resolution*0.5;
    vec2 pos   = vec2(v_uv*mix(0.0,0.1,distance(mouse,vec2(0.0))));
    vec3 color = smoothstep(0.4,0.6,noise(pos*mouse, u_time))*vec3(1.0);
    gl_FragColor = vec4(color, 1.0);
}
