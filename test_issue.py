import pandas as pd
import numpy as np

s = pd.Series([np.nan, np.nan, np.nan])
print(s.value_counts(dropna=True, normalize=True))
