"use client";
import { useState, useEffect, useRef, useCallback } from "react";

interface Province {
  code: string;
  name: string;
}

interface Regency {
  code: string;
  name: string;
}

interface CitySelectProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function CitySelect({ value, onChange, placeholder }: CitySelectProps) {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [regencies, setRegencies] = useState<Regency[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(null);
  const [openProvince, setOpenProvince] = useState(false);
  const [openCity, setOpenCity] = useState(false);
  const [provinceSearch, setProvinceSearch] = useState("");
  const [citySearch, setCitySearch] = useState("");
  const [loadingCities, setLoadingCities] = useState(false);
  const provinceRef = useRef<HTMLDivElement>(null);
  const cityRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/wilayah/provinces")
      .then((r) => r.json())
      .then((res) => setProvinces(res.data || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (value) {
      const parts = value.split(", ");
      const cityName = parts[0];
      const provinceName = parts.slice(1).join(", ");
      const foundProvince = provinces.find((p) => p.name === provinceName);
      if (foundProvince) {
        setSelectedProvince(foundProvince);
        setProvinceSearch(foundProvince.name);
      }
    }
  }, [value, provinces]);

  const fetchRegencies = useCallback(async (provinceCode: string) => {
    setLoadingCities(true);
    setRegencies([]);
    try {
      const res = await fetch(`/api/wilayah/regencies/${provinceCode}`);
      const data = await res.json();
      setRegencies(data.data || []);
    } catch {
      // silent
    } finally {
      setLoadingCities(false);
    }
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (provinceRef.current && !provinceRef.current.contains(e.target as Node)) {
        setOpenProvince(false);
      }
      if (cityRef.current && !cityRef.current.contains(e.target as Node)) {
        setOpenCity(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filteredProvinces = provinces.filter((p) =>
    p.name.toLowerCase().includes(provinceSearch.toLowerCase()),
  );

  const filteredRegencies = regencies.filter((r) =>
    r.name.toLowerCase().includes(citySearch.toLowerCase()),
  );

  const handleSelectProvince = (province: Province) => {
    setSelectedProvince(province);
    setProvinceSearch(province.name);
    setOpenProvince(false);
    setCitySearch("");
    onChange("");
    fetchRegencies(province.code);
  };

  const handleSelectCity = (regency: Regency) => {
    const formatted = `${regency.name.replace(/^(Kabupaten|Kota) /, "")}, ${selectedProvince?.name || ""}`;
    onChange(formatted);
    setCitySearch(regency.name);
    setOpenCity(false);
  };

  return (
    <div className="space-y-2">
      <div className="relative" ref={provinceRef}>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Provinsi
        </label>
        <input
          type="text"
          value={provinceSearch}
          onChange={(e) => {
            setProvinceSearch(e.target.value);
            setOpenProvince(true);
          }}
          onFocus={() => setOpenProvince(true)}
          placeholder="Cari provinsi..."
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 dark:border-gray-600 dark:bg-gray-800 dark:text-white/90"
        />
        {openProvince && (
          <div className="absolute z-50 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
            {filteredProvinces.length === 0 && (
              <p className="px-3 py-2 text-sm text-gray-500">Tidak ditemukan</p>
            )}
            {filteredProvinces.map((p) => (
              <button
                key={p.code}
                type="button"
                onClick={() => handleSelectProvince(p)}
                className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  selectedProvince?.code === p.code
                    ? "bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400"
                    : "text-gray-800 dark:text-white/90"
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="relative" ref={cityRef}>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Kota / Kabupaten
        </label>
        <input
          type="text"
          value={citySearch}
          onChange={(e) => {
            setCitySearch(e.target.value);
            setOpenCity(true);
          }}
          onFocus={() => {
            if (selectedProvince && regencies.length > 0) setOpenCity(true);
          }}
          placeholder={selectedProvince ? "Cari kota/kabupaten..." : placeholder || "Pilih provinsi terlebih dahulu"}
          disabled={!selectedProvince}
          suppressHydrationWarning
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-white/90"
        />
        {openCity && (
          <div className="absolute z-50 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
            {loadingCities && (
              <p className="px-3 py-2 text-sm text-gray-500">Memuat...</p>
            )}
            {!loadingCities && filteredRegencies.length === 0 && (
              <p className="px-3 py-2 text-sm text-gray-500">Tidak ditemukan</p>
            )}
            {!loadingCities &&
              filteredRegencies.map((r) => (
                <button
                  key={r.code}
                  type="button"
                  onClick={() => handleSelectCity(r)}
                  className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                    citySearch === r.name
                      ? "bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400"
                      : "text-gray-800 dark:text-white/90"
                  }`}
                >
                  {r.name}
                </button>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
