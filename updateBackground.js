const fs = require('fs');
const path = './frontend/screens';

fs.readdirSync(path).forEach(file => {
  if (file.endsWith('.js')) {
    let content = fs.readFileSync(path + '/' + file, 'utf8');
    
    if (!content.includes('LinearGradient')) {
      // Add import
      content = content.replace(/import.*?from 'react-native';/s, match => match + '\nimport { LinearGradient } from \'expo-linear-gradient\';');
      
      // Wrap SafeAreaView
      content = content.replace(/<SafeAreaView/g, '<LinearGradient colors={[\'#FFFFFF\', \'#FECEE6\']} style={{flex: 1}}>\n    <SafeAreaView');
      content = content.replace(/<\/SafeAreaView>/g, '</SafeAreaView>\n    </LinearGradient>');
      
      // Replace known solid background colors with transparent
      content = content.replace(/backgroundColor:\s*'#FFF0F5'/g, 'backgroundColor: \'transparent\'');
      content = content.replace(/backgroundColor:\s*'#FFEAF2'/g, 'backgroundColor: \'transparent\'');
      content = content.replace(/backgroundColor:\s*'#FFF2F2'/g, 'backgroundColor: \'transparent\'');
      
      // For files that use #fff or #FFFFFF as container background, we can just let LinearGradient sit behind it.
      // Wait, if the container has white background, LinearGradient won't show.
      // Let's replace container background white to transparent.
      content = content.replace(/container:\s*\{\s*flex:\s*1,\s*backgroundColor:\s*'#fff'/g, 'container: {\n    flex: 1,\n    backgroundColor: \'transparent\'');
      content = content.replace(/container:\s*\{\s*flex:\s*1,\s*backgroundColor:\s*'#FFFFFF'/g, 'container: {\n    flex: 1,\n    backgroundColor: \'transparent\'');
      
      fs.writeFileSync(path + '/' + file, content);
      console.log('Updated ' + file);
    }
  }
});
