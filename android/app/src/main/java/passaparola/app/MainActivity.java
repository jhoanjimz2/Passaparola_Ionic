package passaparola.app;

import android.content.Context;
import android.content.res.Configuration;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
  @Override
  protected void attachBaseContext(Context newBase) {
    Configuration override = new Configuration(newBase.getResources().getConfiguration());
    override.fontScale = 1.0f;
    super.attachBaseContext(newBase.createConfigurationContext(override));
  }
}
