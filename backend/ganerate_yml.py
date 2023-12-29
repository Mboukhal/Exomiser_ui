import os

def ganerate_yml(file_name: str, path:str, req_id:str, hop:str="", exo_path:str=""):
  
  file = f"""
analysis:
  genomeAssembly: hg19
  vcf: {path}/{req_id}/{file_name}
  ped:
  proband:
  hpoIds: [{hop}]
  inheritanceModes:
    {{
      AUTOSOMAL_DOMINANT: 0.1,
      AUTOSOMAL_RECESSIVE_HOM_ALT: 0.1,
      AUTOSOMAL_RECESSIVE_COMP_HET: 2.0,
      X_DOMINANT: 0.1,
      X_RECESSIVE_HOM_ALT: 0.1,
      X_RECESSIVE_COMP_HET: 2.0,
      MITOCHONDRIAL: 0.2,
    }}
  analysisMode: PASS_ONLY
  frequencySources:
    [
      THOUSAND_GENOMES,
      TOPMED,
      UK10K,

      ESP_AFRICAN_AMERICAN,
      ESP_EUROPEAN_AMERICAN,
      ESP_ALL,

      EXAC_AFRICAN_INC_AFRICAN_AMERICAN,
      EXAC_AMERICAN,
      EXAC_SOUTH_ASIAN,
      EXAC_EAST_ASIAN,
      EXAC_NON_FINNISH_EUROPEAN,
      GNOMAD_E_AFR,
      GNOMAD_E_AMR,
      GNOMAD_E_EAS,
      GNOMAD_E_NFE,
      GNOMAD_E_SAS,
      GNOMAD_G_AFR,
      GNOMAD_G_AMR,
      GNOMAD_G_EAS,
      GNOMAD_G_NFE,
      GNOMAD_G_SAS,
    ]
  pathogenicitySources: [REVEL, MVP]
  steps:
    [
      failedVariantFilter: {{}},
      variantEffectFilter:
        {{
          remove:
            [
              FIVE_PRIME_UTR_EXON_VARIANT,
              FIVE_PRIME_UTR_INTRON_VARIANT,
              THREE_PRIME_UTR_EXON_VARIANT,
              THREE_PRIME_UTR_INTRON_VARIANT,
              NON_CODING_TRANSCRIPT_EXON_VARIANT,
              NON_CODING_TRANSCRIPT_INTRON_VARIANT,
              CODING_TRANSCRIPT_INTRON_VARIANT,
              UPSTREAM_GENE_VARIANT,
              DOWNSTREAM_GENE_VARIANT,
              INTERGENIC_VARIANT,
              REGULATORY_REGION_VARIANT,
            ],
        }},
      frequencyFilter: {{ maxFrequency: 2.0 }},
      pathogenicityFilter: {{ keepNonPathogenic: true }},
      inheritanceFilter: {{}},
      omimPrioritiser: {{}},
      hiPhivePrioritiser: {{}},
    ]
outputOptions:
  outputContributingVariantsOnly: false
  numGenes: 0
  outputFileName: Pfeiffer-hiphive-exome-PASS_ONLY
  outputFormats: [HTML, JSON, TSV_GENE, TSV_VARIANT, VCF]

"""
  # outputFormats: [TSV_VARIANT, VCF]

  tmp_path = f"{exo_path}/{path}/{req_id}/{file_name}.yml"
  
  with open(tmp_path, "+a") as f:
    f.write(file)
    f.close()
  